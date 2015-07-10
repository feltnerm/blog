Title: Machine Learning with Spark and Docker
Tags: machine learning, docker
About: I was injured this weekend (sprained ankle), and attempted to learn myself some ML! Here are my notes on how I was able to start running ML queries locally and iterate quickly.

Machine learning has recently been gaining a lot more of my interest, and this
weekend I decided I was going to try and get _something_ going. I was able to build a [Apache Spark](https://spark.apache.org/) cluster on
[Hadoop](http://hadoop.apache.org/) running in [Docker container](https://www.docker.com/).
I used [gradle]()
[project](https://github.com/granthenke/spark-demo) that [I forked](https://github.com/feltnerm/spark-demo).
(eat your heart out crawlers!)

Here are my notes so I don't forget, and so you can maybe learn a thing or
two.

Apache Spark is a cluster-computation engine that can do machine-learning (and much more!).
We'll use this to compose ML algorithms using well-tested code, rather than trying to hand-code
complicated ML algorithms ourselves (although that does sound like a good
learning exercise, and there will be a bit of DIY ML involved later).

Spark is made to run on a Hadoop. As I understand it, Spark queries are
sent to Hadoop, and then Hadoop will do the job of decomposing the Spark
job/query into a series of steps that can be distributed over a number of machines and
safely combined when calculations are done. One of Spark's greatest strengths
is that is is able to assemble Map/Reduce jobs _in-memory_ which greatly
increases the speed of our cluster.

This means the compute for our ML algorithms can potentially scale to
thousands of nodes. There may come a day when you're processing a massive
amount of data with a very intense algorithm, but -- fortunately -- today is
not that day. We'll keep it simple for now, but it's good to know what our
limitations and possibilities  are.

Docker is an operating-system virtualizer. Virtual machines virtualize hardware.
Docker virtualizes software. We will use docker to quickly run Hadoop
locally so we can send ML queries for it to process.

This is a great way to get started with new technology if you're at all like
me and need to get your hands dirty with new tools and tech in order to better
grasp them.

## Build our Workspace

[feltnerm/spark-example](https://github.com/feltnerm/spark-example) is a fork of
[granthenke/spark-example](https://github.com/granthenke/spark-demo), a project that uses
gradle (the JVM build tool I am most familiar with)
I simply have updated a few things here and there including some dependencies.
This will help us to do some of the boring stuff including generating a fat JAR -- a JAR containing all of our project
dependencies -- which we can ship up to a Hadoop cluster to evaluate.

If you want to get started then clone that sucker:

```sh
git clone https://github.com/feltnerm/spark-example
cd spark-example
gradle build

# feel free to run one of the following to generate a project for a specific IDE
gradle eclipse
# or
gradle idea
```

## Run a Spark-compatible Hadoop-cluster locally

Now that we have something to run, we need something to run it against.

Lately, I've been diggin' docker for quickly spinning up non-trivial
applications. Looking at Hadoop's docs, it certainly looks like a
relatively non-trivial setup. By that, I mean I would probably get distracted
and move on before I finished.

Fortunately, the [docker-spark](https://github.com/sequenceiq/docker-spark)
project proved to be the perfect way to get Hadoop running locally so I could
run Spark queries against it.

```sh
# pull down spark docker image
docker pull sequenceiq/spark:1.4.0
```

## Build the Spark Query

The following is an example Spark query, and the computation that we hope the
eventually run locally.

The following code will be, more or less, what our Hadoop cluster will run.
This code is ripped right from [@granthenke's spark-example]()

The explanation of how π is calculated from the [Spark examples](http://spark.apache.org/examples.html):

> Spark can also be used for compute-intensive tasks. This code estimates π by "throwing darts" at a circle. We pick random points in the unit square ((0, 0) to (1,1)) and see how many fall in the unit circle. The fraction should be π / 4, so we use this to get our estimate.

```scala
package com.feltnerm.sparkexample

import scala.math.random

import org.apache.spark._
import org.apache.spark.SparkContext._

/** Computes an approximation to pi */
object SparkPi {
  def main(args: Array[String]) {
    if (args.length == 0) {
      System.err.println("Usage: SparkPi <master> [<slices>]")
      System.exit(1)
    }

    // Process Args
    val conf = new SparkConf()
      .setMaster(args(0))
      .setAppName(this.getClass.getCanonicalName)
      .setJars(Seq(SparkContext.jarOfClass(this.getClass).get))

    val spark = new SparkContext(conf)
    val slices = if (args.length > 1) args(1).toInt else 2
    val n = 100000 * slices

    // Run spark job
    val count = spark.parallelize(1 to n, slices).map { i =>
      val x = random * 2 - 1
      val y = random * 2 - 1
      if (x*x + y*y < 1) 1 else 0
    }.reduce(_ + _)

    // Output & Close
    println("Pi is roughly " + 4.0 * count / n)
    spark.stop()
  }
}
```

We're going to run the above code against a Spark-able Hadoop cluster, but
first we need to build a fat JAR -- a JAR with _all_ of our sources. We can
use `gradle` for this!

```sh
# build hadoop fat jar
% ./gradlew build
% ls build/libs/
spark-example-1.0-hadoop.jar  spark-example-1.0-javadoc.jar spark-example-1.0-sources.jar spark-example-1.0.jar
```

Once we have our JAR ready, we run a new Spark container, and
run the Spark fat-JAR that we just created via a shared filesystem mount.

```sh
# run spark docker image, with the local build directory (`./build/libs/`) mounted under libs
# submit job to spark (example of SparkPi w/ arguments)
# note this is running on the spark cluster
docker run --name spark --rm -it -p 8088:8088 -p 8042:8042 -v "$(pwd)/build/libs/:/libs/" sequenceiq/spark:1.4.0 bash
```

Let's go over this...

We're interactively (`--it`) running (`run`) a Docker container named 'spark'
(`--name spark`) based off the '1.4.0' tag of sequenceiq's spark image
(`sequenceiq/spark:1.4.0`) which we want to remove any trace of when we exit (`--rm`),
mapping ports 8088 and 8042 from the container to the host
(`-p 8088:8088 -p 8042:8042`) so we can remotely access Hadoop if needed,
and mounting the local directory containing our build artifacts to the container
(`$(pwd)/builds/libs/:/libs/`). Once the container starts we run `bash` (which sets up `$SCALA_HOME` and `$JAVA_HOME` for us),
and from here we can start our job..


The last step is to actually submit our job via `spark-submit`:

```sh
spark-submit \
--class com.feltnerm.sparkexample.SparkPi \
--master yarn-client \
--driver-memory 1g \
--executor-memory 1 \
--executor-cores 1 \
/libs/sparkexample-1.0-hadoop.jar local[2] 100
```

The above command is submitting the `/libs/sparkexample-1.0-hadoop.jar` to
Spark. The reason we are setting `--master yarn-client` is because
this is a single node cluster, and we only want the master node the run the
job.

Next, I'll post some actual machine learning algorithms and Spark code.
