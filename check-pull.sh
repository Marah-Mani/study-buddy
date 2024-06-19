#!/bin/bash

# Fetch the latest changes from the remote
git fetch origin

# Get the current branch name
branch=$(git rev-parse --abbrev-ref HEAD)

# Check if the development branch exists locally
if ! git show-ref --quiet refs/heads/development; then
    echo -e "\e[31mThe development branch does not exist locally. Please pull the development branch.\e[0m"
    exit 1
fi

# Check if the current branch contains all changes from the remote development branch
if ! git merge-base --is-ancestor origin/development HEAD; then
    echo -e "\e[31mYour branch does not contain all changes from the development branch. Please pull the latest changes from development.\e[0m"
    exit 1
else
    echo -e "\e[32mYour branch contains all changes from the development branch.\e[0m"
fi
