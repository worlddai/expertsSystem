#!/bin/sh

die () {
    echo $* >&2
    exit 1
}
doit () {
    echo "$ $*" >&2
    $* || die "[ERROR:$?]"
}

META=META.yml
DIST=dist

[ -f $META ] || die "$META Is not found"

class=`grep '^name:' $META | sed 's/^.*: *//;'`
ver=`grep '^version:' $META | sed 's/^.*: *//;'`
main=lib/`echo $class | sed 's:\.:/:g;'`.js

[ "$class" == "" ] && die "Invalid $META (unknown name:)"
[ "$ver" == "" ] && die "Invalid $META (unknown version:)"

[ -f $main ] || die "$main is not found for $class class"

grep -q $class'.VERSION *= *"'$ver $main || die "Version mismatch: $main and $META ($ver)"
linkname=$class-$ver
[ -f $linkname ] && die "$linkname file is exist."
[ -d $linkname ] && die "$linkname directory is exist."
[ -L $linkname ] && die "$linkname link is exist."

doit pod2text $main > README

ln -s . $linkname
archname=$class-$ver.tar

doit tar cvf $archname `sed "s:^:$linkname/:" MANIFEST`

doit rm -f $linkname

doit gzip -9 $archname

doit ls -l $archname.gz

echo "Done."
