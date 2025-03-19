from graph_utils import GraphUtils
import unittest

class ValidationTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.gu = GraphUtils()

    def assert_no_error(self):
        # Verification of the red border style
        self.gu.assert_domain_border_style("")
        self.gu.assert_truth_vector_border_style("")

        # Verification of error messages
        self.gu.assert_domain_error_message_not_displayed()
        self.gu.assert_truth_vector_error_message_not_displayed()
        self.gu.assert_truth_vector_invalid_quantity_error_message_not_displayed()

    def assert_domain_error(self):
        # Verification of the red border style
        self.gu.assert_domain_border_style("border: 2px solid red")
        self.gu.assert_truth_vector_border_style("")

        # Verification of error messages
        self.gu.assert_domain_error_message_displayed()
        self.gu.assert_truth_vector_error_message_not_displayed()
        self.gu.assert_truth_vector_invalid_quantity_error_message_not_displayed()

    def assert_truth_vector_invalid_input_error(self):
        # Verification of the red border style
        self.gu.assert_domain_border_style("")
        self.gu.assert_truth_vector_border_style("border: 2px solid red")

        # Verification of error messages
        self.gu.assert_domain_error_message_not_displayed()
        self.gu.assert_truth_vector_error_message_displayed()
        self.gu.assert_truth_vector_invalid_quantity_error_message_not_displayed()

    def assert_truth_vector_invalid_quantity_error(self):
        # Verification of the red border style
        self.gu.assert_domain_border_style("")
        self.gu.assert_truth_vector_border_style("border: 2px solid red")

        # Verification of error messages
        self.gu.assert_domain_error_message_not_displayed()
        self.gu.assert_truth_vector_error_message_not_displayed()
        self.gu.assert_truth_vector_invalid_quantity_error_message_displayed()

    @classmethod
    def tearDownClass(cls):
        cls.gu.teardown()

    ##############################################################################################################
    # Test Cases
    ##############################################################################################################

    def test_correct_input_in_both_fields(self):
        # --Correct input in both Domain and Truth vector--
        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2, 3')
        self.gu.render(False)
        self.assert_no_error()

        print('Test passed! The form controls display no error messages or red borders.')

    def test_invalid_domain_with_empty_truth_vector(self):
        # --False input in Domain, no input in Truth vector => false input error in domain--
        # Stimulation
        self.gu.set_domains('Hello World')
        self.gu.set_truth_vector('')
        self.gu.render(False)

        self.assert_domain_error()

        print('Test passed! The domain form control has the correct error styling and error message is displayed.')

    def test_negative_domain_with_empty_truth_vector(self):
        # --False input in Domain (negative number), no input in Truth vector => false input error in domain--
        # Stimulation
        self.gu.set_domains('-2, -2, 3')
        self.gu.set_truth_vector('')
        self.gu.render(False)

        self.assert_domain_error()

        print('Test passed! The domain form control has the correct error styling and error message is displayed.')

    def test_decimal_domain_with_empty_truth_vector(self):
        # --False input in Domain (decimal number), no input in Truth vector => false input error in domain--
        # Stimulation
        self.gu.set_domains('2, 2.2, 3')
        self.gu.set_truth_vector('')
        self.gu.render(False)

        self.assert_domain_error()

        print('Test passed! The domain form control has the correct error styling and error message is displayed.')

    def test_invalid_domain_with_valid_truth_vector(self):
        # --False input in domain, correct input in truthVector => false input error in domain--
        # Stimulation
        self.gu.set_domains('Hello World')
        self.gu.set_truth_vector('2, 2, 1, 3')
        self.gu.render(False)

        self.assert_domain_error()

        print('Test passed! The domain form control has the correct error styling and error message is displayed.')

    def test_valid_domain_with_invalid_truth_vector(self):
        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('Hello World')
        self.gu.render(False)

        self.assert_truth_vector_invalid_input_error()
        print(
            'Test passed! The truth vector form control has the correct error styling and error message is displayed.')

    def test_valid_domain_invalid_truth_vector_length(self):
        # --Good input in domain, wrong quantity of numbers in truth vector => incorrect quantity error--
        # Stimulation
        self.gu.set_domains('2, 2, 3')
        self.gu.set_truth_vector('0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 2')
        self.gu.render(False)

        self.assert_truth_vector_invalid_quantity_error()
        print(
            'Test passed! The truth vector form control has the correct error styling and quantity error message is displayed.')

if __name__ == "__main__":
    unittest.main()