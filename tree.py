#!/usr/bin/env python3
import os
import sys

def generate_tree(directory_path):
    """Generate a directory tree displaying filenames in a hierarchical structure."""
    abs_path = os.path.abspath(directory_path)

    for root, _, files in os.walk(abs_path):
        level = root.replace(abs_path, "").count(os.sep)
        indent = "    " * level
        for file in sorted(files):
            print(f"{indent}- {file}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: scope.py <directory_path>")
        sys.exit(1)

    directory_path = sys.argv[1]
    if not os.path.isdir(directory_path):
        print(f"Error: {directory_path} is not a valid directory.")
        sys.exit(1)

    generate_tree(directory_path)
