<template>
    <div class="input-block">
        <label>
            <span class="label-text">{{ label }}</span>
            <input
                type="text"
                autofocus
                :maxlength="maxlength"
                v-model="inputData"
                @keydown.enter="validateText"
            />
        </label>
    </div>
</template>

<script>
export default {
    name: 'TheInput',
    props: {
        label: {
            required: true,
            default: 'Введите текст',
        },
        maxlength: {
            default: false,
        },
        valueProp: {
            default: '',
        },
    },
    data() {
        return {
            inputData: '',
        }
    },
    created() {
        this.inputData = this.valueProp
    },
    methods: {
        validateText() {
            if (this.inputData) {
                this.$emit('selectedText', this.inputData)
            }
        },
    },
    watch: {
        valueProp(newVal) {
            if (newVal !== this.inputData) this.inputData = newVal
        },
    },
}
</script>

<style scoped>
.input-block {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 12px;
}
.label-text {
	display: block;
}
</style>