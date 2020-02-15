class UserHelper():
    def calulateUserRating(user=None):
        if user is None:
            return 1
        else:
            profile_completness = user.profile_completness if user.profile_completness else 0
            general_question_result = user.general_question_result if user.general_question_result else 0
            test_question_result = user.test_question_result if user.test_question_result else 0
            print(profile_completness)

            print(general_question_result)
            print(test_question_result)
            rating = (20*((profile_completness + 1) / 100) + 30*(general_question_result / 100) + 50*(test_question_result / 100))
            print(rating)
            return rating