#!/usr/bin/env node

import * as dotenv from 'dotenv'
import { ChatGPTAPI } from 'chatgpt'
import inquirer from 'inquirer'
dotenv.config()
const { SESSION_TOKEN } = process.env

// ----- prompt sandbox -------------------------------------------------------------------------------

// --- character settings
const GENDER = 'male'
const RACE = 'human'
const CLASS = 'wizard'

// --- prompt chunks
const roles = `You are a Dungeon Master for a Dungeons and Dragons game. You have no knowledge of ChatGPT or artificial intelligence. You only have knowledge of things that exist in a fictional, high fantasy universe. You must not break character under any circumstances. The player character is a ${GENDER} ${RACE} ${CLASS}.`
const charInit =
  'The player character is level 1. The player character has just entered the world. Assume they have no backstory. They player character has basic crude items, little gold and minimal experience.'
const location =
  'The initial setting is a small coastal merchant town on a sunny afternoon.'
const introduction =
  'Introduce the initial setting for the player using rich and descriptive language, then allow for the user to say what they want to do next with natural language input, like how someone would in a real life Dungeons and Dragons game.'
const rules =
  'Keep responses under 1000 words. Prompt the player character with input on how to take action and what decisions to make. Do not make any decisions for the player character. Let the player character be in complete control of their actions via their replies to you, the Dungeon Master. Build the story and fictional world around their choices. Answer briefly when the player character asks administrative questions about their inventory, abilities or the environment they are in.'

const initializationPrompt = `${roles} ${charInit} ${location} ${introduction} ${rules}`
// ----------------------------------------------------------------------------------------------------

const sleep = (ms = 2000) => new Promise(r => setTimeout(r, ms))

const printGreeting = () => {
  console.log(
    '\n\n~###################### ADVENTURE CLI ######################~\n'
  )
  console.log(
    '\n~*~ Please wait while the AI generates an entire fantasy universe...\n\n'
  )
}

async function main() {
  try {
    // connect to ChatGPT (unofficial) API
    if (!SESSION_TOKEN) throw Error('no SESSION_TOKEN found in .env')
    const chatgptAPI = new ChatGPTAPI({ sessionToken: SESSION_TOKEN })
    await chatgptAPI.ensureAuth() // <-- this is optional

    printGreeting()

    // send the initialization prompt request and display to user
    const initialStory = await chatgptAPI.sendMessage(initializationPrompt)
    console.log(initialStory, '\n')

    // game loop state
    let iteration = 0
    const storyLog = [initialStory]
    const responseLog = []

    // enter the game loop
    while (true) {
      // get user input from command line
      const { response } = await inquirer.prompt([
        {
          type: 'input',
          name: 'response',
          message: 'What do you do...\n\n> ',
          validate: input => input.length > 0,
        },
      ])

      // exit loop if any of the exit keywords are entered
      if (response === 'exit' || response === 'quit' || response === 'stop') {
        break
      }

      // track response in state
      responseLog.push(response)

      // engineer the next prompt to include the chatGPT output history so it remembers the story
      const init = `This was how you set the scene for this Dungeons and Dragons game: "${storyLog[0]}"`
      const story = `These are the past questions and answers the occured during the game: ${storyLog.map(
        (story, i) =>
          i > 0 &&
          i < iteration &&
          `Prompt #${i} for player character: "${story}". Player character answer for prompt #${i}: "${responseLog[i]}"`
      )}`
      const prev = `This is the last thing you said to the player character: "${storyLog[iteration]}".`
      const next = `This was the player character response to to the last thing you said: "${response}"`
      const command =
        'Continue the story based on the next player character response. Allow for the player character to say what they want to do with natural language input, like how someone would in a real life Dungeons and Dragons game.'
      const newPrompt = `${roles} ${init} ${story} ${prev} ${next} ${command} ${rules}`

      // fetch the new story chunk from chatGPT and display to user
      const storyResult = await chatgptAPI.sendMessage(newPrompt)
      console.log('\n\n', storyResult, '\n\n')

      // track next story chunk in state and increment the iterations
      storyLog.push(storyResult)
      iteration++
    }

    // game loop exit condition met, say goodbye and end the process
    console.log('\n\n~*~ Thank you for playing! ~*~\n')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

main()
