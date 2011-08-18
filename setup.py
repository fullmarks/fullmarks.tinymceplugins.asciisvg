# coding=utf-8

from setuptools import setup, find_packages
import os

version = '1.2'

setup(name='fullmarks.tinymceplugins.asciisvg',
      version=version,
      description="ASCIISvg Plugin for TinyMCE in Plone for drawing a graph of function in SVG",
      long_description=open("README.rst").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      # Get more strings from
      # http://pypi.python.org/pypi?:action=list_classifiers
      classifiers=[
        "Programming Language :: Python",
        "Framework :: Plone",
        ],
      keywords='svg mathematics plone',
      author='roche@upfrontsystems.co.za',
      author_email='',
      url='http://github.com/fullmarks/fullmarks.tinymceplugins.asciisvg',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['fullmarks', 'fullmarks.tinymceplugins'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          # -*- Extra requirements: -*-
      ],
      entry_points="""
      # -*- Entry points: -*-
      [z3c.autoinclude.plugin]
      target = plone
      """,
      )
