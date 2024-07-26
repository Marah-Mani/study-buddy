#!/bin/bash

# Fetch the latest changes from the remote
git fetch origin

# Get the current branch name
branch=$(git rev-parse --abbrev-ref HEAD)

# Check if the current branch contains the latest commit from the remote development branch
if git merge-base --is-ancestor origin/development "$branch"; then
    echo -e "\e[32mYour branch is up to date with the development branch.\e[0m"
else
    echo -e "\e[31mYour branch is not up to date with the development branch. Please pull the latest changes from development.\e[0m"
    exit 1
fi
