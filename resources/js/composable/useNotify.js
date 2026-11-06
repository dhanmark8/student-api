
import { reactive } from 'vue';

const message = reactive({
    text: '',
    type: 'success',
});

let timer = null;

export function useNotify() {
    function notify(text, type = 'success') {
        message.text = text;
        message.type = type;

        clearTimeout(timer);

        timer = setTimeout(() => {
            message.text = '';
        }, 4000);
    }

    return { message, notify };
}
