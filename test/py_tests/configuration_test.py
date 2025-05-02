from graph_utils import GraphUtils
from enums import *
import os
import unittest
import random
import time

class ConfigurationTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.gu = GraphUtils()
        cls.downloaded_image_path_png = os.path.join(os.path.expanduser('~'), 'Downloads', 'Decision_Diagram.png')
        cls.expected_image_path = os.path.join('expected_graph_diagrams')

    def setUp(self):
        self.gu.reset_application()
        # Delete image if it already exists
        self.gu.delete_image(self.downloaded_image_path_png)

    @classmethod
    def tearDownClass(cls):
        cls.gu.teardown()

    def test_correct_number_of_styling_selectors(self):
        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 3')
        self.gu.enable_styling()

        # Verification
        self.gu.assert_number_of_styling_selectors(3)
        print('Test passed! Correct number of the styling selectors appeared.')

    def test_correct_number_of_styling_selectors_random(self):
        # Generate random number of domains (between 1 and 5)
        num_domains = random.randint(1, 5)

        # Generate random domain values
        domain_values = []
        for i in range(num_domains):
            domain_values.append(random.randint(1, 5))

        # Create the domains string
        domains = ", ".join(str(value) for value in domain_values)

        # Calculate the total number of truth values needed (product of domains)
        total_values = 1
        for value in domain_values:
            total_values *= value

        # Generate random truth vector values
        truth_values = []
        for i in range(total_values):
            truth_values.append(str(random.randint(0, 10)))

        # Create the truth vector string
        truth_vector = ", ".join(truth_values)

        # Number of selectors expected
        max_domain = max(domain_values)

        # Stimulation
        self.gu.set_domains(domains)
        self.gu.set_truth_vector(truth_vector)
        self.gu.enable_styling()

        # Verification
        self.gu.assert_number_of_styling_selectors(max_domain)
        print(f"Test passed! {max_domain} styling selectors appeared as expected.")

    def test_correct_number_of_coloring_selectors(self):
        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 2')
        self.gu.enable_coloring()

        # Verification
        self.gu.assert_number_of_coloring_selectors(3)
        print('Test passed! Correct number of the coloring selectors appeared.')

    def test_correct_number_of_coloring_selectors_random(self):
        # Generate random number of domains (between 1 and 5)
        num_domains = random.randint(1, 5)

        # Generate random domain values
        domain_values = []
        for i in range(num_domains):
            domain_values.append(random.randint(1, 5))

        # Create the domains string
        domains = ", ".join(str(value) for value in domain_values)

        # Calculate the total number of truth values needed (product of domains)
        total_values = 1
        for value in domain_values:
            total_values *= value

        # Generate random truth vector values
        truth_values = []
        for i in range(total_values):
            truth_values.append(str(random.randint(0, 10)))

        # Create the truth vector string
        truth_vector = ", ".join(truth_values)

        # Number of selectors expected
        max_domain = max(domain_values)

        # Stimulation
        self.gu.set_domains(domains)
        self.gu.set_truth_vector(truth_vector)
        self.gu.enable_coloring()

        # Verification
        self.gu.assert_number_of_coloring_selectors(max_domain)
        print(f"Test passed! {max_domain} coloring selectors appeared as expected.")

    def test_empty_styling_and_coloring_selectors(self):
        # Stimulation
        self.gu.safe_clear_input(self.gu.domain_input)
        self.gu.enable_styling()
        self.gu.enable_coloring()

        # Verification
        self.gu.assert_number_of_styling_selectors(0)
        self.gu.assert_number_of_coloring_selectors(0)
        print('Test passed! No styling or coloring selectors appeared.')

    def test_styling(self):
        expected_image_path = os.path.join(self.expected_image_path, 'expected_styling.png')

        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 2')
        self.gu.enable_styling()
        self.gu.set_edge_style(2, EdgeStyle.DASHED)
        self.gu.render()
        self.gu.scroll_down_control_panel()
        self.gu.export(ExportFormat.PNG)
        self.gu.wait_for_image(self.downloaded_image_path_png)

        # Verification
        assert self.gu.images_are_identical(self.downloaded_image_path_png, expected_image_path), "The images are different."
        print('Test passed! Styling selector affected the graph.')

    def test_coloring(self):
        expected_image_path = os.path.join(self.expected_image_path, 'expected_coloring.png')

        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 2')
        self.gu.enable_coloring()
        self.gu.set_edge_color(2, EdgeColor.PINK)
        self.gu.render()
        self.gu.scroll_down_control_panel()
        self.gu.export(ExportFormat.PNG)
        self.gu.wait_for_image(self.downloaded_image_path_png)

        # Verification
        assert self.gu.images_are_identical(self.downloaded_image_path_png, expected_image_path), "The images are different."
        print('Test passed! Coloring selector affected the graph.')

    def test_font_selector(self):
        expected_image_path = os.path.join(self.expected_image_path, 'expected_font.png')

        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 2')
        self.gu.set_font(Font.HELVETICA)
        self.gu.render()
        self.gu.export(ExportFormat.PNG)
        self.gu.wait_for_image(self.downloaded_image_path_png)

        # Verification
        assert self.gu.images_are_identical(self.downloaded_image_path_png, expected_image_path), "The images are different."
        print('Test passed! Font selector affected the graph.')

    def test_font_selector_custom_font(self):
        expected_image_path = os.path.join(self.expected_image_path, 'expected_custom_font.png')

        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 2')
        self.gu.set_font(Font.MY_OWN_FONT)
        self.gu.set_custom_font('Consolas')
        self.gu.render()
        self.gu.scroll_down_control_panel()
        self.gu.export(ExportFormat.PNG)
        self.gu.wait_for_image(self.downloaded_image_path_png)

        # Verification
        assert self.gu.images_are_identical(self.downloaded_image_path_png, expected_image_path), "The images are different."
        print('Test passed! Custom font affected the graph.')

    def test_show_labels(self):
        expected_image_path = os.path.join(self.expected_image_path, 'expected_show_labels.png')

        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 2')
        self.gu.enable_labels()
        self.gu.render()
        self.gu.export(ExportFormat.PNG)
        self.gu.wait_for_image(self.downloaded_image_path_png)

        # Verification
        assert self.gu.images_are_identical(self.downloaded_image_path_png, expected_image_path), "The images are different."
        print('Test passed! Custom font affected the graph.')

    def test_hide_labels(self):
        expected_image_path = os.path.join(self.expected_image_path, 'expected_hidden_labels.png')

        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 2')
        self.gu.disable_labels()
        self.gu.render()
        self.gu.export(ExportFormat.PNG)
        self.gu.wait_for_image(self.downloaded_image_path_png)

        # Verification
        assert self.gu.images_are_identical(self.downloaded_image_path_png, expected_image_path), "The images are different."
        print('Test passed! Custom font affected the graph.')

    def test_show_editor(self):
        self.gu.toggle_editor()
        self.gu.assert_editor_visible()

    def test_hide_editor(self):
        self.gu.toggle_editor()
        self.gu.toggle_editor()
        self.gu.assert_editor_hidden()

    def test_editor_typing(self):
        expected_image_path = os.path.join(self.expected_image_path, 'expected_editor_edit.png')

        # Define a constant for the line number
        line_to_change = 4

        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 2')
        self.gu.toggle_editor()
        self.gu.render()
        self.gu.edit_editor_line(line_to_change, 'node [shape = triangle] 2 4 7;')
        # Verification of editor content
        assert self.gu.get_editor_line_content(
            line_to_change) == '    node [shape = triangle] 2 4 7;', "The content is not as expected."

        # Stimulation
        self.gu.export(ExportFormat.PNG)
        self.gu.wait_for_image(self.downloaded_image_path_png)

        # Verification of exported image content
        assert self.gu.images_are_identical(self.downloaded_image_path_png, expected_image_path), "The images are different."
        print('Test passed! Editor text was set correctly and affected the export image.')

if __name__ == "__main__":
    unittest.main()