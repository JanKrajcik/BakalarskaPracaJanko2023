import unittest

# Load all tests from directory
test_suite = unittest.defaultTestLoader.discover('.', pattern='*_test.py')

runner = unittest.TextTestRunner()
runner.run(test_suite)