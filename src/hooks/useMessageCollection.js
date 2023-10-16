import { useState } from 'react'

/**
 * A custom hook for managing the conversation between the user and the AI.
 *
 * @returns {Object} An object containing the `messages` array and the `addMessage` function.
 */

export var initial = {
    id: 1,
    createdAt: Date.now(),
    text: "The Magic Academy corridor is bustling with students hurrying to class. Sophia, in her usual haphazard way, runs through the corridor, her magical books and supplies spilling out of her open satchel. *Sophia, caught up in her own chaotic world, crashes into ..., their bodies entangled. She looks up at ... with sparkling eyes and a bright smile, exclaiming, 'Oh, I am so sorry! I didn't see you there! Are you new here?'*",
    ai: true
}

const useMessageCollection = () => {
  const initialMsg = initial;
  const [messages, setMessages] = useState([initialMsg]);

  /**
  * A function for adding a new message to the collection.
  *
  * @param {Object} message - The message to add to the collection.
  */
  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  }

  const clearMessages = () => setMessages([initialMsg])

  return [messages, addMessage, clearMessages];
}

export default useMessageCollection