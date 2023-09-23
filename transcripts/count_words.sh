#!/bin/bash

# Counts the total number of words from all transcripts
cut -f3 *.tsv | wc -w