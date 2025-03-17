#!/usr/bin/env bash

# Update package lists
apt-get update

# Install dependencies for reportlab & PyGObject
apt-get install -y \
    libfreetype6-dev \
    libjpeg-dev \
    zlib1g-dev \
    libgirepository1.0-dev \
    gir1.2-gtk-3.0 \
    gcc \
    python3-dev

# Upgrade pip
pip install --upgrade pip setuptools wheel
