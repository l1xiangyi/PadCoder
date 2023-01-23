import React, {useEffect, useState} from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  ScrollView,
  useWindowDimensions,
  useColorScheme,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';

import ApiCaller from '../api/apicaller';
import {ProblemDetail} from '../api/interfaces';
import ACSvg from '../svg/ac';
import RejSvg from '../svg/rej';

export const CodingPage: React.FC = () => {
  const navigator: any = useNavigation();
  enum JudgeStatus {
    NOTSUBMITTED,
    AC,
    REJ,
  }
  const [question, setQuestion] = useState<ProblemDetail>(
    null as unknown as ProblemDetail,
  );
  const [code, setCode] = useState('');
  const [testAccepted, setTestAccepted] = useState(JudgeStatus.NOTSUBMITTED);

  // logic for rendering html strings in the problem details part.
  const {width} = useWindowDimensions();
  const theme = useColorScheme();
  const tagStyles = {
    body: {
      color: theme === 'dark' ? 'white' : 'black',
    },
  };

  const handleBack = () => {
    navigator.navigate('main');
  };

  const getQuestionDetail = async () => {
    const data = await ApiCaller.getInstance().getProblemDetail('two-sum');

    if (data) {
      setQuestion(data);
      for (const snippet of data.codeSnippets) {
        if (snippet.langSlug === 'python3') {
          setCode(snippet.code);
        }
      }
    }
  };

  const handleTest = async () => {
    const testcases = await ApiCaller.getInstance().getTestCases(
      question.titleSlug,
    );

    try {
      const res = await ApiCaller.getInstance().testSolution(
        question.titleSlug,
        testcases,
        'python3',
        '1',
        code,
      );

      setTimeout(async () => {
        const testResult: any = await ApiCaller.getInstance().getResult(
          res.interpret_id as string,
        );

        setTestAccepted(JudgeStatus.NOTSUBMITTED);
        // setSolutionAccepted(JudgeStatus.NOTSUBMITTED);
        if (testResult) {
          if (testResult === 10) {
            setTestAccepted(JudgeStatus.AC);
          } else {
            setTestAccepted(JudgeStatus.REJ);
          }
        }
      }, 500);
    } catch (err) {
      console.log(err);
    }
  };

  // const handleSubmit = async () => {
  //   try {
  //     const res = await ApiCaller.getInstance().submitSolution(
  //       question.titleSlug,
  //       'python3',
  //       '1',
  //       code,
  //     );
  //     setTestAccepted(JudgeStatus.NOTSUBMITTED);
  //     setSolutionAccepted(JudgeStatus.NOTSUBMITTED);

  //     setTimeout(async () => {
  //       const testResult: any = await ApiCaller.getInstance().getResult(
  //         res as string,
  //       );

  //       console.log(testResult);
  //       if (testResult) {
  //         if (testResult === 10) {
  //           setSolutionAccepted(JudgeStatus.AC);
  //         } else {
  //           setSolutionAccepted(JudgeStatus.REJ);
  //         }
  //       }
  //     }, 1500);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  useEffect(() => {
    getQuestionDetail();
  }, []);

  return (
    <View className="flex flex-row w-screen h-screen">
      <View className="w-[37.14vw] h-screen bg-[#FBFBFB] dark:bg-[#1D1D1D]">
        <Pressable
          className="ml-[2.271vw] mt-[5vh] w-[13.11vw] h-[5.785vh]"
          onPress={() => handleBack()}>
          <Text className="text-black dark:text-white text-[3.077vw]">
            {question?.title}
          </Text>
        </Pressable>
        <ScrollView className="ml-[2.271vw] mb-[8vh] mr-[2vw]">
          <RenderHTML
            tagsStyles={tagStyles}
            contentWidth={width}
            source={{html: question?.content}}
          />
        </ScrollView>
      </View>
      <View className="flex-1 flex-col">
        <View className="w-full h-[83.496vh] bg-[#FFFDF3] dark:bg-[#27292E]">
          <TextInput
            multiline={true}
            numberOfLines={100}
            value={code}
            onChangeText={setCode}
            autoCapitalize={'none'}
            className="ml-[2.271vw] mt-[3.03vh] h-full w-[59vw] bg-[#FFFDF3] dark:bg-[#27292E] text-black dark:text-white text-base leading-8"
          />
        </View>
        <View className="flex-1 bg-[#E7E7E7] dark:bg-black">
          {testAccepted === JudgeStatus.AC && (
            <View className="flex-row ml-[4.615vw] mt-[4.59vh] w-[26.454vw] h-[7.324vh] items-center justify-between">
              <ACSvg />
              <Text className="text-white text-[2.2vw] text-semibold leading-1 ">
                Great! Test Passed!
              </Text>
            </View>
          )}
          {testAccepted === JudgeStatus.REJ && (
            <View className="flex-row ml-[4.615vw] mt-[4.59vh] w-[32.454vw] h-[7.324vh] items-center justify-between">
              <RejSvg />
              <Text className="text-white text-[2.2vw] text-semibold leading-1 ">
                Hmmm...Maybe try again?
              </Text>
            </View>
          )}
          <Pressable
            className="absolute ml-[45.18vw] mt-[7.3vh] w-[14vw] h-[4.2vh] border-solid border-2 border-[#FFAA44] rounded-[20px] items-center justify-center"
            onPress={() => handleTest()}>
            <Text className="text-[#FFAA44] text-[1.46vw] text-semibold">
              Test
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
