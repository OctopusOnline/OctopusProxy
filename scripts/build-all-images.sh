#!/bin/sh

# ------ goto-project-root helper ------

if [ -d "$(pwd)/images" ]; then
  cd $(pwd)
elif [ -d "../images" ]; then
  cd ..
else
  echo "Error: Project-Root not found"
  exit 1
fi

#---------------------------------------

for image in images/*/ ; do
  if [ -d "$image" ] && [ -f "$image/build.sh" ]; then
    (cd "$image" && ./build.sh)
  fi
done