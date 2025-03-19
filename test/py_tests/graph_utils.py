import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import time
import hashlib
import difflib
from skimage.metrics import structural_similarity as ssim
import numpy as np
from PIL import Image

# Functions outside the class:

def set_input(input_box, value):
    input_box.clear()
    input_box.send_keys(value)

class GraphUtils:
    def __init__(self):
        self.editor = None
        self.toggle_editor_button = None
        self.font_selector = None
        self.labels_checkbox = None
        self.control_panel = None
        self.coloring_checkbox = None
        self.styling_checkbox = None
        self.error_message_truth_vector_invalid_quantity = None
        self.error_message_truth_vector = None
        self.error_message_domain = None
        self.truth_vector_form_control = None
        self.domain_form_control = None
        self.export_button = None
        self.export_format_selector = None
        self.render_button = None
        self.truth_vector_input = None
        self.domain_input = None
        self.driver = None

        self._setup_browser()
        self.gather_elements()

    def _setup_browser(self):
        os.environ['PATH'] += r"C:/Program Files/SeleniumDrivers/chrome-win64"
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.driver.get("https://mddvisualizer.z36.web.core.windows.net")
        self.driver.implicitly_wait(1)
        self.gather_elements()

    # Reset app without closing and opening the browser
    def reset_application(self):
        self.driver.get("https://mddvisualizer.z36.web.core.windows.net")
        self.gather_elements()

    # Part of the initialisation process. Gather all relevant elements needed for the tests.
    def gather_elements(self):
        self.control_panel = self.driver.find_element(By.CLASS_NAME, "control-panel")
        self.domain_input = self.driver.find_element(By.ID, 'domain')
        self.truth_vector_input = self.driver.find_element(By.ID, 'truthVector')
        self.render_button = self.driver.find_element(By.ID, 'renderButton')
        self.styling_checkbox = self.driver.find_element(By.ID, 'stylingCheckbox')
        self.coloring_checkbox = self.driver.find_element(By.ID, 'colorCheckbox')
        self.font_selector = self.driver.find_element(By.ID, "Font")
        self.labels_checkbox = self.driver.find_element(By.ID, 'labelsCheckbox')
        self.toggle_editor_button = self.driver.find_element(By.ID, "toggleEditorButton")
        self.export_format_selector = self.driver.find_element(By.ID, 'format')
        self.export_button = self.driver.find_element(By.ID, 'exportButton')
        self.domain_form_control = self.driver.find_element(
            By.XPATH,
            "//div[contains(@class, 'form-control')][.//label[contains(text(), 'Domain')]]"
        )
        self.truth_vector_form_control = self.driver.find_element(
            By.XPATH,
            "//div[contains(@class, 'form-control')][.//label[contains(text(), 'Truth Vector')]]"
        )
        self.error_message_domain = self.driver.find_element(By.ID, "domainError")
        self.error_message_truth_vector = self.driver.find_element(By.ID, "truthVectorError")
        self.error_message_truth_vector_invalid_quantity = self.driver.find_element(
            By.ID, "truthVectorInvalidQuantity"
        )
        self.editor = self.driver.find_element(By.ID, "editor")

    def teardown(self):
        self.driver.quit()


    ##############################################################################################################
    # Domain methods
    ##############################################################################################################

    def set_domains(self, domains):
        set_input(self.domain_input, domains)

    def assert_domain_border_style(self, expected_style):
        self.wait_for_style_to_contain(self.domain_form_control, expected_style)
        domain_border_style = self.domain_form_control.get_attribute("style")
        assert expected_style in domain_border_style, f"Expected {expected_style} in domain border style, but got: {domain_border_style}"

    def assert_domain_error_message_displayed(self):
        assert self.error_message_domain.get_attribute("style").find("display: block") != -1, "Error message for domain input is not displayed!"

    def assert_domain_error_message_not_displayed(self):
        assert self.error_message_domain.get_attribute("style").find(
            "display: none") != -1, "Error message for domain input is not displayed!"

    ##############################################################################################################
    # Truth vector methods
    ##############################################################################################################
    def set_truth_vector(self, truth_vector):
        set_input(self.truth_vector_input, truth_vector)

    def assert_truth_vector_border_style(self, expected_style):
        self.wait_for_style_to_contain(self.truth_vector_form_control, expected_style)
        truth_vector_border_style = self.truth_vector_form_control.get_attribute("style")
        assert expected_style in truth_vector_border_style, f"Expected {expected_style} in truth vector border style, but got: {truth_vector_border_style}"

    def assert_truth_vector_error_message_displayed(self):
        assert self.error_message_truth_vector.get_attribute("style").find("display: block") != -1, "Error message for truth vector input is not displayed!"

    def assert_truth_vector_error_message_not_displayed(self):
        assert self.error_message_truth_vector.get_attribute("style").find(
            "display: none") != -1, "Error message for truth vector input is not displayed!"

    def assert_truth_vector_invalid_quantity_error_message_displayed(self):
        assert self.error_message_truth_vector_invalid_quantity.get_attribute("style").find("display: block") != -1, "Error message for invalid quantity of inputs in truth vector is not displayed!"

    def assert_truth_vector_invalid_quantity_error_message_not_displayed(self):
        assert self.error_message_truth_vector_invalid_quantity.get_attribute("style").find(
            "display: none") != -1, "Error message for invalid quantity of inputs in truth vector is not displayed!"

    # Render image and wait for it to complete
    def render(self, check_working=True):
        self.render_button.click()

        if not check_working:
            return

        WebDriverWait(self.driver, 10).until(
            lambda d: "working" in d.find_element(By.ID, "viewCanvas").get_attribute("class")
        )

        # Wait for viewCanvas to lose "Working" class (rendering completes)
        WebDriverWait(self.driver, 10).until(
            lambda d: "working" not in d.find_element(By.ID, "viewCanvas").get_attribute("class")
        )

    ##############################################################################################################
    # Styling and coloring methods
    ##############################################################################################################

    def enable_styling(self):
        if not self.styling_checkbox.is_selected():
            self.styling_checkbox.click()

    def disable_styling(self):
        if self.styling_checkbox.is_selected():
            self.styling_checkbox.click()

    def assert_number_of_styling_selectors(self, expected_number):
        # Find the parent container for edge styling
        dynamic_edge_style_menu = self.driver.find_element(By.ID, "dynamicEdgeStyleMenu")

        # Find all selectors inside the container
        selectors = dynamic_edge_style_menu.find_elements(By.TAG_NAME, "select")

        # Count selectors
        actual_number = len(selectors)

        # Assert number of selectors is as expected
        assert actual_number == expected_number, f"Found {actual_number} style selectors but expected {expected_number}"

    def set_edge_style(self, edge_index, style_value):
        # Find the selector by its ID
        selector_id = f"dynamicEdgeStyle{edge_index}"

        # Find the selector element
        style_selector = self.driver.find_element(By.ID, selector_id)
        style_selector.click()
        style_selector.send_keys(style_value.value)
        style_selector.click()

    def set_edge_color(self, edge_index, color_value):
        # Find the selector by its ID
        selector_id = f"dynamicEdgeColor{edge_index}"

        # Find the selector element
        style_selector = self.driver.find_element(By.ID, selector_id)
        style_selector.click()
        style_selector.send_keys(color_value.value)
        style_selector.click()

    def enable_coloring(self):
        if not self.coloring_checkbox.is_selected():
            self.coloring_checkbox.click()

    def disable_coloring(self):
        if self.coloring_checkbox.is_selected():
            self.coloring_checkbox.click()

    def assert_number_of_coloring_selectors(self, expected_number):
        # Find the parent container for edge styling
        dynamic_edge_style_menu = self.driver.find_element(By.ID, "dynamicEdgeColorMenu")

        # Find all selectors inside the container
        selectors = dynamic_edge_style_menu.find_elements(By.TAG_NAME, "select")

        # Count selectors
        actual_number = len(selectors)

        # Assert number of selectors is as expected
        assert actual_number == expected_number, f"Found {actual_number} style selectors but expected {expected_number}"

    def set_font(self, font_value):
        self.font_selector.click()
        self.font_selector.send_keys(font_value.value)
        self.font_selector.click()

    def set_custom_font(self, font_value):
        custom_font_input = self.driver.find_element(By.ID, 'customFont')
        set_input(custom_font_input, font_value)

    ##############################################################################################################

    def set_separators(self, separators):
        separator_selector = self.driver.find_element(By.ID, "separator")
        separator_selector.click()
        separator_selector.send_keys(separators.value)
        separator_selector.click()

    def enable_labels(self):
        if not self.labels_checkbox.is_selected():
            self.labels_checkbox.click()

    def disable_labels(self):
        if self.labels_checkbox.is_selected():
            self.labels_checkbox.click()

    ##############################################################################################################
    # ACE Editor methods
    ##############################################################################################################

    def toggle_editor(self):
        self.toggle_editor_button.click()

    def assert_editor_hidden(self):
        editor_style = self.editor.get_attribute("style")
        assert "display: none" in editor_style, "Editor is visible but should be hidden!"

    def assert_editor_visible(self):
        editor_style = self.editor.get_attribute("style")
        assert "display: block" in editor_style or "display: none" not in editor_style, \
            "Editor is hidden but should be visible!"

    # Get all lines from ACE editor
    def get_editor_lines(self):
        self.assert_editor_visible()
        # Find all ace_line elements
        ace_lines = self.driver.find_elements(By.CLASS_NAME, "ace_line")
        return ace_lines

    def edit_editor_line(self, line_index, new_content):
        ace_lines = self.get_editor_lines()

        if line_index < 0 or line_index >= len(ace_lines):
            raise IndexError(f"Line index {line_index} is out of range (0-{len(ace_lines) - 1})")

        target_line = ace_lines[line_index]

        # Click on the target line
        actions = ActionChains(self.driver)
        actions.move_to_element(target_line).click().perform()

        # Replace the content of the line
        actions.send_keys(Keys.HOME).perform()
        actions.key_down(Keys.SHIFT).send_keys(Keys.END).key_up(Keys.SHIFT).perform()
        #actions.send_keys(Keys.DELETE).perform()
        actions.send_keys(new_content).perform()

    def get_editor_line_content(self, line_index):
        """Get content of a specific editor line by index"""
        try:
            # Get all lines from the editor
            ace_lines = self.get_editor_lines()

            # Try to get the line
            line = ace_lines[line_index]

            # Return the content of the line
            return line.text
        except Exception as e:
            # Catch all exceptions and print a generic message
            print(f"Failed to get line {line_index}: {str(e)}")
            # Return empty string instead of raising the error
            return ""

    ##############################################################################################################

    # Export the graph as a png or svg
    def export(self, export_format):
        self.export_format_selector.click()
        self.export_format_selector.send_keys(export_format.value)
        self.export_format_selector.click()
        self.export_button.click()

    ##############################################################################################################
    # Utility functions
    ##############################################################################################################

    def wait_for_style_to_contain(self, element, expected_style, timeout=10):
        return WebDriverWait(self.driver, timeout).until(
            lambda d: expected_style in element.get_attribute("style")
        )

    # --Image manipulation functions--
    # Delete image file
    @staticmethod
    def delete_image(image_path):
        if os.path.exists(image_path):
            os.remove(image_path)

    # Wait for the image to download
    @staticmethod
    def wait_for_image(image_path, timeout=10):
        start_time = time.time()
        while not os.path.exists(image_path):
            if time.time() - start_time > timeout:
                raise Exception("Timeout waiting for the image to download")
            time.sleep(1)

    @staticmethod
    def images_are_identical(downloaded_image_path, expected_image_path, threshold=0.99):
        # Convert images to grayscale for SSIM comparison
        img1 = np.array(Image.open(downloaded_image_path).convert('L'))
        img2 = np.array(Image.open(expected_image_path).convert('L'))

        # Resize if needed
        if img1.shape != img2.shape:
            img2 = np.array(Image.open(expected_image_path).convert('L').resize(img1.shape[::-1]))

        score, _ = ssim(img1, img2, full=True)
        print(f"SSIM similarity: {score:.10f}")

        return score >= threshold

        return similarity >= threshold

    @staticmethod
    def svg_files_are_identical(downloaded_svg_path, expected_svg_path, threshold=0.9999):

        # Read files as text
        with open(downloaded_svg_path, 'r', encoding='utf-8') as file1:
            downloaded_content = file1.readlines()

        with open(expected_svg_path, 'r', encoding='utf-8') as file2:
            expected_content = file2.readlines()

        # Calculate similarity
        similarity = difflib.SequenceMatcher(None,
                                             ''.join(downloaded_content),
                                             ''.join(expected_content)).ratio()

        print(f"SVG similarity: {similarity:.10f}")

        return similarity >= threshold

    @staticmethod
    def safe_clear_input(input_box):
        # Focus on the element
        input_box.click()

        # Clear by selecting all and deleting
        ActionChains(input_box.parent) \
            .key_down(Keys.CONTROL if os.name == 'nt' else Keys.COMMAND) \
            .send_keys('a') \
            .key_up(Keys.CONTROL if os.name == 'nt' else Keys.COMMAND) \
            .send_keys(Keys.DELETE) \
            .perform()

        # Trigger blur event
        ActionChains(input_box.parent).click(input_box).send_keys(Keys.TAB).perform()

    def scroll_down_control_panel(self):
        scroll_height = self.control_panel.get_property('scrollHeight')
        client_height = self.control_panel.get_property('clientHeight')

        # Only scroll down if the control panel is scrollable
        if scroll_height > client_height:
            self.control_panel.send_keys(Keys.PAGE_DOWN)