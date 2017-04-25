#!/usr/bin/env python

"""Creates or updates distribution files"""

import subprocess

print "Updates JavaScript and Type Definition files..."
subprocess.call(['rm', 'dist', '-rf'])
subprocess.call(['tsc', '--declaration'])
