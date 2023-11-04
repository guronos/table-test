<template>
    <div id="app">
        <TheTable />
    </div>
</template>

<script>
import TheTable from './components/TheTable.vue'

export default {
    name: 'App',
    components: {
        TheTable,
    },
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.btn {
    display: inline-block;
    box-sizing: border-box;
    padding: 0 20px;
    margin: 4px;
    outline: none;
    border: none;
    border-radius: 4px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    color: #fff;
    background-color: #3775dd;
    box-shadow: 0 2px #21487f;
    cursor: pointer;
    user-select: none;
}

.btn:hover {
    background-color: #002fed;
}

.btn:active {
    background-color: #2f599e !important;
}

.btn:disabled {
    opacity: 0.3;
    pointer-events: none;
}

@media screen and (max-width: 400px) {
    body {
        font-size: 12px;
    }
}
</style>
