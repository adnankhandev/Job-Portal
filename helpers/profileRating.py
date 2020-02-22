class UserHelper():
    def calulateUserRating(user=None, increment = 0):
        if user is None:
            return 1
        else:
            profile_completness = user.profile_completness if user.profile_completness else 0
            general_question_result = user.general_question_result if user.general_question_result else 0
            test_question_result = user.test_question_result if user.test_question_result else 0
            print(profile_completness)

            rating = ((profile_completness + increment) * 0.2) +  (general_question_result * 0.3) + (test_question_result * 0.5)
            return rating