// https://coderun.yandex.ru/selections/2024-summer-frontend/problems/in-stream

const LAST_RENDERED_ID_KEY = 'lastRenderedId';
const WAITING_UPDATES_KEY = 'waitingUpdates';
const CHATS_KEY = 'chats';

let lastRenderedId;
let waitingUpdates;
let chats;

const readState = () => {
    lastRenderedId = Number(window.localStorage.getItem(LAST_RENDERED_ID_KEY)) || 0;
    waitingUpdates = JSON.parse(window.localStorage.getItem(WAITING_UPDATES_KEY)) || [];
    chats = JSON.parse(window.localStorage.getItem(CHATS_KEY)) || {};
};

const writeState = () => {
    window.localStorage.setItem(LAST_RENDERED_ID_KEY, lastRenderedId)
    window.localStorage.setItem(WAITING_UPDATES_KEY, JSON.stringify(waitingUpdates));
    window.localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
};

const getUpdatesToApply = (update) => {
    if (waitingUpdates.length === 0) {
        if (update.id === lastRenderedId + 1) {
            return [update];
        }

        waitingUpdates.push(update);

        return;
    }

    if (update.id !== lastRenderedId + 1) {
        const idx = waitingUpdates.findIndex((val) => val.id > update.id);
        waitingUpdates.splice(idx < 0 ? waitingUpdates.length : idx, 0, update);

        return;
    }

    const idx = waitingUpdates.findIndex((val) => val.id > update.id);
    waitingUpdates.splice(idx < 0 ? waitingUpdates.length : idx, 0, update);

    for (let i = 1; i < waitingUpdates.length; i++) {
        if (waitingUpdates[i - 1].id + 1 !== waitingUpdates[i].id) {
            return waitingUpdates.splice(0, i);
        }
    }

    const cp = [...waitingUpdates];

    waitingUpdates = [];

    return cp;
}

const updateChats = (update) => {
    const chat = chats[update.message.chatId];

    if (!chat) {
        chats[update.message.chatId] = [update.message];

        return;
    }

    switch (update.type) {
        case 'new':
            chat.push(update.message);

            break;
        case 'updated':
            const i = chat.findIndex((message) => message.id === update.message.id);
            chat[i].body = update.message.body;

            break;
        case 'deleted':
            const j = chat.findIndex((message) => message.id === update.message.id);
            chat.splice(j, 1);

            break;
    }
}

const callback = (update) => {
    readState();

    const updatesToApply = getUpdatesToApply(update);

    if (!updatesToApply) {
        window.localStorage.setItem(WAITING_UPDATES_KEY, JSON.stringify(waitingUpdates));

        return;
    }

    updatesToApply.forEach((update) => updateChats(update));

    lastRenderedId = updatesToApply[updatesToApply.length - 1].id;

    chat.renderMessages(chats);

    writeState();
}

let chat = new Chat(callback);

window.addEventListener('storage', ({ key, newValue }) => {
    if (key === CHATS_KEY) {
        chat.renderMessages(JSON.parse(newValue));
    }
});
