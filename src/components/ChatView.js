
import React, { useState, useRef, useEffect, useContext } from 'react';
import ChatMessage from './ChatMessage';
import { ChatContext } from '../context/chatContext';
import Thinking from './Thinking';
import { MdSend } from 'react-icons/md';
import Filter from 'bad-words';
import { davinci } from '../utils/davinci';
import { dalle } from '../utils/dalle';
// import { whisper } from '../utils/whisper';
import Modal from './Modal';
import Setting from './Setting';

import { initial } from '../hooks/useMessageCollection';
import { first_messages, model_descriptions, response_features ,bot_responses, user_prompts, histories } from './history';
/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [formValue, setFormValue] = useState('');
  const [thinking, setThinking] = useState(false);
  const options = ['Sophia', 'Beliville'];
  const [selected, setSelected] = useState(options[0]);
  const [messages, addMessage] = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);
  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, ai = false, selected) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      selected: `${selected}`,
    };
    addMessage(newMsg);
  };
  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async (e) => {
    e.preventDefault();
    const key = window.localStorage.getItem('api-key');
    if (!key) {
      setModalOpen(true);
      return;
    }
    const filter = new Filter();
    const cleanPrompt = filter.isProfane(formValue)
      ? filter.clean(formValue)
      : formValue;
    const newMsg = cleanPrompt;

    
    user_prompts.push(cleanPrompt);
    histories.push({role: 'user', content: cleanPrompt});
    
    const aiModel = selected;
    setThinking(true);
    setFormValue('');
    updateMessage(newMsg, false, aiModel);
    try {
  
        console.log(options[0], 'DDDDDDDDD')
        const response = await davinci(cleanPrompt, key);  // Call the davinci function
        const data = response.data.choices[0].message.content; 
        console.log("response-----", response.data.choices[0].message.content)
        bot_responses.push(data);
        histories.push({role: 'assistant', content: data});
        // let data = "";
        // stream.toString().split("\n").forEach((line) => {
        //   if (line.trim() !== "") {
        //     const message = line.replace(/^data: /, ""); 
        //     if (message === "[DONE]" || JSON.parse(message).choices[0].finish_reason === 'stop') 
        //       return
        //     let token;
        //     token = JSON.parse(message).choices[0].delta.content;
        //     data += token;
        //   }
        // });
        data && updateMessage(data, true, aiModel);
        setThinking(false);
    
    } catch (err) {
      window.alert(`Error: ${err} please try again later`);
    }
    setThinking(false);
  };

  console.log("cleanPrompt----",  user_prompts, bot_responses, histories)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // 👇 Get input value
      sendMessage(e);
    }
  };
  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);
  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // window.localStorage.setItem('option', selected);

  // useEffect(() => {
  //     if(previous_state !== selected){
  //       previous_state = window.localStorage.getItem('option');
        
  //       var histories = [
  //         {
  //             role: 'system',
  //             content: model_descriptions[selected] + response_features[selected],
  //         },
  //         {
  //             role: 'assistant',
  //             content: first_messages[selected],
  //         }
  //       ]
  //       window.location.reload();

  //     }
  // }, [selected]);

  
  const handleChange = (selected_model) => {
    console.log(';;;;;;;;selected_model;;;;;;;;', selected_model)
    setSelected(selected_model);

    initial.text = first_messages[selected_model];
    console.log("BBBBBBBBB", initial)
    
  
    
    histories = [];
    bot_responses = [];
    user_prompts = [];

    histories.push(
        {
          role: 'system',
          content: model_descriptions[selected_model] + response_features[selected_model],
        },
        {
          role: 'assistant',
          content: first_messages[selected_model]
        }
      )
    console.log('EEEEEEEEEEEEEEEEEEEE', histories)
  }

  return (
    <div className='chatview'>
      <main className='chatview__chatarea'>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={{ ...message }} />
        ))}
        {thinking && <Thinking />}
        <span ref={messagesEndRef}></span>
      </main>
      <form className='form' onSubmit={sendMessage}>
        <select
          value={selected}
          onChange={(e) => handleChange(e.target.value)}
          className='dropdown'>
          <option>{options[0]}</option>
          <option>{options[1]}</option>
        </select>
        <div className='flex items-stretch justify-between w-full'>
          <textarea
            ref={inputRef}
            className='chatview__textarea-message'
            value={formValue}
            onKeyDown={handleKeyDown}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button
            type='submit'
            className='chatview__btn-send'
            disabled={!formValue}>
            <MdSend size={30} />
          </button>
        </div>
      </form>
      <Modal title='Setting' modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal>
    </div>
  );
};
export default ChatView;
