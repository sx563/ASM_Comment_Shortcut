#!/bin/sh
#  This file uninstalls the toggle comment shortcut for assembly kernels.

jupyter nbextension disable ASM_Comment_Shortcut/main
jupyter nbextension uninstall ASM_Comment_Shortcut
