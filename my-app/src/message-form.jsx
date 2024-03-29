import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleRight } from "@fortawesome/free-solid-svg-icons"

function Form(props) {
    if (props.chat?.group) {
        var groupConn
        var groupPeer = new Peer(props.chat.name, {debug: 0})
        var groupSenderPeer = new Peer(`${props.chat.name}-helper`, {debug: 0})
    
        groupPeer.on('open', () => {
            props.chat.members.map((e) => {
                groupConn = groupPeer.connect(e, {receiver: true})
                
                groupConn.on('open', () => {
                    console.log("connected to: " + groupConn.peer)
                })
                
                groupConn.on('data', (data) => {
                    const newMessage = {string: data.string, sender: data.sender, receiver: props.chat.name, group: true, helper: true}
                    
                    props.chat.members.map((e) => {
                        let newConn
                        newConn = groupSenderPeer.connect(e, {receiver: true})
                        
                        newConn.on('open', () => {
                            newConn.send(newMessage)
                        })
                        
                        newConn.on('close', () => {
                            console.log("connection closed: " + newConn.peer)
                        })
                    })
                })
            })
        })
        groupSenderPeer.on('open', () => console.log("group open sender: " + groupSenderPeer.id))
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (e.target[0].value === "") return
        
        const newMessage = {string: e.target[0].value, group: props.chat?.group}
        
        props.send(newMessage)

        e.target[0].value = ""
    }

    return (
        <form onSubmit={handleSubmit} className="form-msg">
            <input
                className="input-msg"
                type="text"
                autoComplete="off"
                placeholder="Write a message..."
            />
            
            <button type="submit" className="btn-msg">
                <FontAwesomeIcon icon={faCircleRight} />
            </button>
        </form>
    )
}

export default Form