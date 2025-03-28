import os
from graph_utils import GraphUtils
from enums import *
import unittest

# This test case verifies that the website can:
#   take an input,
#   render a graph,
#   export it as an image.

class InputToExport(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.gu = GraphUtils()
        downloaded_image_path = os.path.join(os.path.expanduser('~'), 'Downloads')
        expected_image_path = os.path.join('expected_graph_diagrams')
        cls.downloaded_image_path_png = os.path.join(downloaded_image_path, 'Decision_Diagram.png')
        cls.downloaded_image_path_svg = os.path.join(downloaded_image_path, 'Decision_Diagram.svg')
        cls.expected_image_path_png = os.path.join(expected_image_path, 'expected_input_to_export.png')
        cls.expected_image_path_svg = os.path.join(expected_image_path, 'expected_input_to_export.svg')

    def setUp(self):
        # Delete image if it already exists
        self.gu.delete_image(self.downloaded_image_path_png)
        self.gu.delete_image(self.downloaded_image_path_svg)

    @classmethod
    def tearDownClass(cls):
        cls.gu.teardown()

    def test_input_to_export_png_positive(self):
        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 2')
        self.gu.render()
        self.gu.export(ExportFormat.PNG)
        self.gu.wait_for_image(self.downloaded_image_path_png)

        # Verification
        assert self.gu.images_are_identical(self.downloaded_image_path_png,
                                            self.expected_image_path_png), "The images are different."
        print('Test passed! The images are the same.')


    def test_input_to_export_png_negative(self):
        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 3')
        self.gu.render()
        self.gu.export(ExportFormat.PNG)
        self.gu.wait_for_image(self.downloaded_image_path_png)

        # Verification
        assert not self.gu.images_are_identical(self.downloaded_image_path_png,
                                                self.expected_image_path_png), "The images are the same."
        print('Test passed! The images are different.')

    def test_input_to_export_svg_positive(self):
        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 2')
        self.gu.render()
        self.gu.export(ExportFormat.SVG)
        self.gu.wait_for_image(self.downloaded_image_path_svg)

        # Verification
        assert self.gu.svg_files_are_identical(self.downloaded_image_path_svg,
                                               self.expected_image_path_svg), "The images are different."
        print('Test passed! The images are the same.')

    def test_input_to_export_svg_negative(self):
        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 3')
        self.gu.render()
        self.gu.export(ExportFormat.SVG)
        self.gu.wait_for_image(self.downloaded_image_path_svg)

        # Verification
        assert not self.gu.svg_files_are_identical(self.downloaded_image_path_svg,
                                                   self.expected_image_path_svg), "The images are the same."
        print('Test passed! The images are different.')

    def test_input_to_export_separators(self):
        # Stimulation
        self.gu.set_separators(Separators.SPACE)
        self.gu.set_domains('2 2 3')
        self.gu.set_truth_vector('0 0 0 0 1 1 0 1 1 0 2 2')
        self.gu.render()
        self.gu.export(ExportFormat.PNG)
        self.gu.wait_for_image(self.downloaded_image_path_png)

        # Verification
        assert self.gu.images_are_identical(self.downloaded_image_path_png,
                                            self.expected_image_path_png), "The images are different."
        print('Test passed! The images are the same.')

        # Set separators back to default
        self.gu.set_separators(Separators.COMMA)

if __name__ == "__main__":
    unittest.main()