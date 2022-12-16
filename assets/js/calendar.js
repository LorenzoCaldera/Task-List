let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]
let quests = []

let i = -1
let days
let date = new Date()
let currentMonth = date.getMonth()
let currentYear = date.getFullYear()

let currentDate = document.getElementById("CurrentDate")
let tbody = document.getElementsByTagName("tbody")
let span = $('#daily-quests')
let ul = span.find('ul')

const showSpan = () => {
    document.body.dataset.quests = "false"
}

const monthLength = (month, year) => {
    return 32 - (new Date(year, month, 32)).getDate()
}

const handlerSetInput = (event) => {
    document.body.dataset.quests = "true"

    let $date = document.createElement('h3')
    $date.innerText = event.path[0].innerText + " " + currentDate.innerText

    setInput(false)
}

const dailyQuests = (quest) => {
    i++
    let il = i

    quests[il] = {
        name: quest.name,
        check: quest.check,
        expanded: quest.expanded,
        cycle: quest.cycle,
        data:[]
    }

    let $quest = $(`
        <li class="quest">
            <div>
                <i class="check ${quest.check ? "fa-solid fa-square-check" : "fa-regular fa-square"}"></i>
                <p title="${quest.name}">${quest.name}</p>
                <div>
                    <button class="btn addsubQuest">
                        <i class="fa-regular fa-plus"></i>
                    </button>
                    <button class="btn delete">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
            <button class="btn expand ${(quest.data?.length > 0) ? "" : "d-none"} ${quest.expanded ? "rotate" : ""}">
                <i class="fa-solid fa-angle-right"></i>
            </button>
            <div id=${il} class="hidden"></div>
        </li>
    `)

    const addSubQuest = (subquest) => {
        let $subQuest = $(`
            <div draggable="true" class="subquest">
                <i class="check ${subquest.check ? "fa-solid fa-square-check" : "fa-regular fa-square"}"></i>
                <p title="${subquest.text}">${subquest.text}</p>
                <button class="btn delete">
                    <i class="fa-solid fa-solid xmark"></i>
                </button>
            </div>
        `)

        let subCheck = $subQuest.find('.check')

        subCheck.hover(
            () => {subCheck.removeClass("fa-square").addClass("fa-square-check")},
            () => {
                if(!subquest.check) subCheck.addClass("fa-square")
            },
        )

        subCheck.click(() => {
            subCheck
                .removeClass("fa-square-check")
                .addClass("fa-square")
                .toggleClass("fa-regular fa-square fa-solid fa-square-check")

            subquest.check = !subquest.check
        })

        $subQuest.find('.delete').click(() => {
            $subQuest.remove()
            quests[il].data.splice(quests[il].data.indexOf(subquest), 1)

            quests[il].data.length == 0 ? questExpand.addClass("d-none") : ""
        })

        questExpand.removeClass("d-none")

        $(`#${il}`).append($subQuest)

        if (subquest.text === "") {
            let subText = $subQuest.find('p')

            questExpand.addClass("rotate")

            subText.attr('contenteditable', 'true')

            subText.on('focus', function() {
                var selection = window.getSelection()
                var range = document.createRange()
    
                range.selectNodeContents(this)
    
                selection.removeAllRanges()
                selection.addRange(range)
            })
            
            subText.focus()
    
            subText.keydown((e) => {
                if (e.keyCode === 13 && subText[0].innerText !== "") {
                    subText.attr('contenteditable', 'false')
                    quests[il].data.push({"text": subText[0].innerText, "check": false})
                    quests[il].check = false
                    quests[il].expanded = true
                }
            })

            subText.blur(() => {
                if (subText.attr('contenteditable') === "true") {
                    subText.attr('contenteditable', 'false')
                    $subQuest.remove()
                    questExpand.addClass('d-none')
                    quests[il].expanded = false
                }
            })
        } else {
            quests[il].data.push(subquest)
        }
    }

    var questCheck = $quest.find(".check")
    var questExpand = $quest.find(".expand")

    questCheck.hover(
        () => { questCheck.removeClass("fa-square").addClass("fa-square-check")},
        () => {
            if (quests[il].check !== undefined && !quests[il].check) {
                questCheck.addClass("fa-square")
            }
        },
    )

    questCheck.click(() => {
        let subCheck = $quest.find(`#${il} > div > i`)

        quests[il].check = !quests[il].check

        if (quests[il].check) {
            questCheck
                .removeClass("fa-square fa-regular")
                .addClass("fa-solid fa-square-check")

            subCheck
                .removeClass("fa-regular fa-square")
                .addClass("fa-solid fa-square-check")
        } else {
            questCheck
                .addClass("fa-regular fa-square")
                .removeClass("fa-solid fa-square-check")

            subCheck
                .addClass("fa-regular fa-square")
                .removeClass("fa-solid fa-square-check")
        }

        Object.values(quests[il].data).map((e) => {
            e.check = quests[il].check
        })
    })

    questExpand.click(() => {
        console.log("I'm working")
        questExpand.toggleClass("rotate")
    })

    $quest.find(".addsubQuest").click(() => {
        addSubQuest({"text": "", "check": false})
    })

    $quest.find('.delete').click((e) => {
        $quest.remove()
        quests.splice(il, 1)
    })
    
    ul.append($quest)
}

const createCalendar = (month, year) => {
    currentDate.innerText = months[month] + " " + String(year)

    let InitialDay = (new Date(year, month)).getDay()
    days = 1
    let maxDays = monthLength(month, year)
    
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr")

        for (let j = 0; j < 7; j++) {

            let td = document.createElement("td")

            td.innerText = days
            td.addEventListener("click", handlerSetInput)
            
            if (j < InitialDay && i === 0 || days > maxDays) {
                td.innerHTML = ""
            } else {
                days++
            }

            row.append(td)
        }

        tbody[0].append(row)
    }
}

const changeMonth = (bool) => {
    let num = sign = newMonth = 0

    if (bool) {
        num = 11
        sign = 1
    } else {
        sign = -1
        newMonth = 11
    }

    if (currentMonth === num) {
        currentYear += sign
        currentMonth = newMonth
    } else {
        currentMonth += sign
    }

    let save = tbody[0].children[0]

    tbody[0].innerHTML = ""

    tbody[0].append(save)

    createCalendar(currentMonth, currentYear)
}

createCalendar(currentMonth, currentYear)