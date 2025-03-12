# CUAD Contract Processing and Neo4j Import

This repository contains tools to process contracts from the CUAD (Contract Understanding Atticus Dataset) and import them into a Neo4j graph database.

## About CUAD

The Contract Understanding Atticus Dataset (CUAD) is a collection of contracts with annotations for various legal clauses.
It's designed to help train and evaluate legal AI systems.
You can learn more and access the dataset at [the Atticus Project website](https://www.atticusprojectai.org/cuad).
You need to download the CUAD dataset in this folder if you wish to run the processing pipeline

## Overview

This project provides two main workflows:

1. **Full Pipeline** - Process contracts with LLMs and import into Neo4j, `process_and_import.ipynb` notebook
2. **Import Only** - Import pre-processed contracts directly into Neo4j, `import.ipynb` notebook