import React from "react"
import { nanoid } from "nanoid"
import Form from "./message-form"
import Message from "./message"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleUser } from "@fortawesome/free-solid-svg-icons"

function MessagesList(props) {
    const printMessages = props.messagesStorage.map((e, i) => {
        let printSVG = ""

        if (i + 2 <= props.messagesStorage.length) {
            if (e.sender !== props.messagesStorage[i + 1].sender) {
                printSVG = <FontAwesomeIcon icon={faCircleUser} />
            }
        } else {
            printSVG = <FontAwesomeIcon icon={faCircleUser} />
        }

        if (!e.yours) {
            return (
                <div key={`msg-${nanoid()}`} className="received">
                    {printSVG}
                    <Message
                        string={e.string}
                        sender={e.sender}
                    />
                </div>
            )
        } else {
            return  (
                <div key={`msg-${nanoid()}`} className="sended">
                    <Message
                        string={e.string}
                        sender={e.sender}
                    />
                    {printSVG}
                </div>
            )
        }
    })

    return (
        <div id="messages__list">
            <div className="messages">
                {printMessages}
            </div>
            <Form chat={props.chatOpen} send={props.send} />
        </div>
    )
}

export default MessagesList