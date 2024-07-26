#!/bin/bash

# Fetch the latest changes from the remote
git fetch origin

# Ask for the branch name
echo "Enter the branch name (leave blank to use current branch):"
read branch_name

# Use the current branch if no branch name is provided
if [ -z "$branch_name" ]; then
    branch_name=$(git rev-parse --abbrev-ref HEAD)
else
    # Check if the branch exists locally or remotely
    if ! git rev-parse --verify "$branch_name" >/dev/null 2>&1 && ! git ls-remote --exit-code --heads origin "$branch_name" >/dev/null 2>&1; then
        # Create a new branch with the provided name
        git checkout -b "$branch_name"
    else
        # Checkout the existing branch
        git checkout "$branch_name"
    fi
fi

# Check if the current branch is up to date with the development branch
if git merge-base --is-ancestor origin/development "$branch_name"; then
    echo -e "\e[32mSUCCESS: Your branch is up to date with the development branch.\e[0m"
else
    echo -e "\e[31mERROR: Your branch is not up to date with the development branch. Please pull the latest changes from development.\e[0m"
    exit 1
fi

# Stage all changes
git add .

# Commit the changes
git commit -m "Commit changes to $branch_name"

# Push the changes to the remote branch
git push origin "$branch_name"

# Optionally, create a pull request (you might need to use a CLI tool or API for your Git hosting service)
# Example using GitHub CLI (gh)
# gh pr create --base development --head "$branch_name" --title "Pull request for $branch_name" --body "Description of the changes"
