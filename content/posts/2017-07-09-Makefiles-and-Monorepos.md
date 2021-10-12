Title: Make Monorepo
Tags: front-end, Makefile, monorepo, npm
About: Using Makefiles to manage monorepos.
Status: draft

_If you would like to skip the ceremony and jump right into the code checkout the
[accompanying GitHub repo](https://github.com/feltnerm/monorepo-es6-dev)._

This my account of using `make` to maintain and automate a "modern"-Javascript monorepo including why I did it, how, and maybe some reasons why you should or should not do the same.

My first experience with `make` was years ago when I had to compile drivers for my WiFi card (atheros drivers and linux ... ugh).
For a long time since then `make` was just the step you ran after
`./configure` and before `make install`. Until recently, I honestly thought
`make` was a build tool for specifically running gcc and compiling C programs.

A couple of months ago, when I was working on a [monorepo](http://danluu.com/monorepo/) project. The current trendy tool to manage monorepos is called [lerna](https://lernajs.io/), and it is super dope. At the time of using it, lerna was still fairly immature and I was personally struggling to get everything working as I wanted.

After reading the blog post
[Make for Hipsters](https://mattandre.ws/2016/05/make-for-hipsters/), I had
become intrigued about the possiblities of good ol' `make`. Had I dismissed
it all these years as an arcane tool?

Using `make` was intriguing because of its minimal nature. It had
zero-dependencies  and was generally already installed on most
developers' machines. `make` also presented a very low barrier between the
task you were running and what was actually going on. No finding the GitHub
repo for some esoteric plugin, just being able to see exactly which shell
commands were run.

# Targets

Along the way, I learned more about `make` than I ever could have imagined. For instance, I never realized the awesomeness and simplicity of `make`'s rules and targets.

At a high level, the way `make` works is that you define how each expected
output file (i.e., target) should be created. Since `make` knows what the expected outcome of
a command should be, it will only run when it needs to.

```Makefile
lib/index.js: lib/index.jsx
	babel --out-file lib/index.jsx lib/index.js
```

The example above is defining a rule to transpile a(n ES6+) JSX file into a ES5 Javascript file. `lib/index.js` is the target, `lib/index.jsx` is the component, and `babel ...` is the command used to produce the target from the component.

What this means is that babel will _only_ run on `lib/index.jsx` _if and only if_ that file has changed in some way. This is a huge win for large projects because re-compiling all the things anytime a file changes can get really expensive and annoying really fast.

# Dynamic Rules

My mind was blown once I discovered how do create `make` rules dynamically.

Dynamic rules are one of the coolest parts of `make` I learned about, and
basically made it possible for `make` to manage _n_ number of common packages within
a single repository. I had to ask a question on StackOverlow, and am so
gracious that I got two fantastic answers, including
[one](http://stackoverflow.com/a/39604692/2405667) that really spelled it out
for me.

In a monorepo the structure might be something like this (in my case it _was_ like this):

```
- Makefile
- packages
  | foo
    | lib
    - src
  - bar
    | lib
    - src
```

As a lazy programmer (and person in general) I did _not_ want to keep adding new Makefile rules and targets for each new package that I'd be adding. This is where dynamic rules come in.

The following code snippet is the gist of it (I'd have to write another (couple) blog posts to explain exactly what's going on here). For any questions I'd suggest checking out my [StackOverflow question and subsequent answers](http://stackoverflow.com/a/39604692/2405667), or checking out the [GNU Make](https://www.gnu.org/software/make/manual/make.html) documentation.

```Makefile
# Directories
PKGS_ROOT := packages
PKGS_SRCDIR := src
PKGS_OUTDIR := lib

# Expands to the source directory for the specified package
pkg-srcdir = $(PKGS_ROOT)/$1/$(PKGS_SRCDIR)
# Expands to the output directory for the specified package
pkg-libdir = $(PKGS_ROOT)/$1/$(PKGS_OUTDIR)

# Expands to all output targets for the specified package
pkg-libs-js = $(addprefix $(call pkg-libdir,$1)/,$(patsubst %.jsx,%.js,$(notdir $(wildcard $(call pkg-srcdir,$1)/*.js*))))

# Defines the following rules for the specified package:
## PER-PACKAGE RULES START HERE
define pkg-rules

# build rule for .js(x) files
$(call pkg-libdir,$1)/%.js: $(call pkg-srcdir,$1)/%.js* | $(call pkg-libdir,$1)
        $(TRANSPILER) $(TRANSPILER_OPTS) --out-file $$@ $$^

endef
## PER-PACKAGE RULES END HERE

# Creates rules for the specified package
add-pkg = $(eval $(call pkg-rules,$1))

# Create rules for all packages
PKGS := $(notdir $(wildcard $(PKGS_ROOT)/*))
$(foreach p,$(PKGS),$(call add-pkg,$p))
```

We start off with a directory of packages: `PKGS_ROOT`. Then, we define `PKGS` to be all the sub-directories of `PKGS_ROOT` (`PKGS := $(notdir $(wildcard $(PKGS_ROOT)/*))`). Last, we execute a command `add-pkg` for each directory found in `PKGS`:

```
add-pkg = $(eval $(call pkg-rules,$1))
PKGS := $(notdir $(wildcard $(PKGS_ROOT)/*))
$(foreach p,$(PKGS),$(call add-pkg,$p))
```

As you can see, unfortunately, `make` has some pretty esoteric syntax that isn't exactly inuitive on your first try. Most of the documentation is really good (despite almost all of the examples dealing with C and C++ code), and there's a ton of examples and other resources online.

Also, `make` doesn't really have a community or plugin-ecosystem, as far as I know, so you won't find simple plug-n-go solutions (although you can [include other Makefiles](https://github.com/tj/react-fatigue-dev)). One cool idea is to take the monorepo Makefile and take out the
monorepo-management commands to make generic and shareable build automation that will work in a variety of environments. It would be great if there was more of a modular `Makefile` community that'd share generic snippets.

As a polyglot programmer, I've used a variety of build tools. From grunt to gulp, pip to setup.py, maven to gradle, and more. Honestly, I love `make`. It is close to the "metal" in that I can see and edit the exact commands being run.

For now, I'm going to stick with using `make` as the main source of automation for front-end development. Especially when a project has outgrown [`npm-scripts`](https://docs.npmjs.com/misc/scripts). It is efficient, explicit, and I think it will be easy to grow my `Makefiles` as development tools come and go.

Actually, at my dayjob we are using `make` for frontend projects now. In fact, we have a monorepo -- fully managed by `make` -- of frontend packages that we can use to build common user interfaces. So far, `make` has been relatively successful. There's some unfamiliarity, but it works, and there is definitely opportunity to simplify the Makefile even more to allow for better interpretation.

`Make` needs another shot. I'd suggest giving it one.
