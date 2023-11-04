<template>
    <div class="table__wrapper">
        <h2 class="table__title">Таблица стран</h2>
        <div class="table__filter">
            <TheInput
                :label="'Введите фильтр по полю \'Код страны alpha-2\''"
                :maxlength="2"
                :valueProp="filterA2"
                @selectedText="setFilter($event)"
            />
            <div>
                <button
                    class="btn"
                    :disabled="!filterA2"
                    @click="setFilter('')"
                >
                    Сбросить фильтр
                </button>
            </div>
        </div>
        <div v-if="entities" class="table__body">
            <div class="rows__wrapper">
                <div class="header">
                    <div
                        v-for="header in headers"
                        class="cell"
                        :style="`width: ${header.width}rem`"
                        :key="header.id"
                    >
                        {{ header.title }}
                    </div>
                </div>
                <div
                    v-for="(entity, idx) in entities"
                    class="line"
                    :key="entity.iso_3166_1_numeric"
                >
                    <div
                        v-for="header in headers"
                        class="cell"
                        :style="`width: ${header.width}rem`"
                        :key="header.id + idx"
                    >
                        <div v-if="header.field === 'id'">
                            {{ idx + paginationData.start_index }}
                        </div>
                        <div v-if="header.field === 'is_shipping_country'">
                            {{ entity[header.field] ? 'Yes' : 'No' }}
                        </div>
                        <div v-else>
                            {{ entity[header.field] }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="pagination__wrapper">
                <div class="quantity-entities">
                    <div class="quantity-entities_visual">
                        Отображать на странице записей
                        <div class="dropdown">
                            <button class="btn">{{ countEntities }}</button>
                            <div class="dropdown-content">
                                <div
                                    v-for="i in [...Array(15).keys()].map(
                                        (j) => j + 1
                                    )"
                                    :key="i"
                                    @click="
                                        countEntities = i
                                        page = 1
                                        getTableData()
                                    "
                                >
                                    {{ i }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="totalCountEntities"
                        class="quantity-entities_all"
                    >
                        Всего записей: {{ totalCountEntities }}
                    </div>
                </div>
                <div class="pagination">
                    <PaginationBtn
                        v-if="paginationData.has_previous"
                        alias="prev"
                        @clicked="
                            getTableData(paginationData.previous_page_number)
                        "
                    />
                    <div class="pages">
                        <div
                            v-if="
                                page !== 1 &&
                                paginationData.previous_page_number !== 1
                            "
                            class="page"
                            @click="getTableData(1)"
                        >
                            1
                        </div>
                        <span v-if="page - 1 > 2">...</span>
                        <div
                            v-if="paginationData.previous_page_number"
                            class="page"
                            @click="
                                getTableData(
                                    paginationData.previous_page_number
                                )
                            "
                        >
                            {{ paginationData.previous_page_number }}
                        </div>
                        <div class="page current-page">{{ page }}</div>
                        <div
                            v-if="paginationData.next_page_number"
                            class="page"
                            @click="
                                getTableData(paginationData.next_page_number)
                            "
                        >
                            {{ paginationData.next_page_number }}
                        </div>
                        <span
                            v-if="
                                getLastPage &&
                                paginationData.next_page_number < getLastPage
                            "
                            >...</span
                        >
                        <div
                            v-if="
                                getLastPage &&
                                getLastPage > paginationData.next_page_number
                            "
                            class="page"
                            @click="getTableData(getLastPage)"
                        >
                            {{ getLastPage }}
                        </div>
                    </div>
                    <PaginationBtn
                        v-if="paginationData.has_next"
                        alias="next"
                        @clicked="getTableData(paginationData.next_page_number)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TheInput from '@/components/TheInput.vue'
import PaginationBtn from '@/components/PaginationBtn.vue'

export default {
    name: 'TheTable',
    components: { PaginationBtn, TheInput },
    data() {
        return {
            URL: 'https://devops100.site/test/',
            headers: [
                {
                    id: 1,
                    title: '№',
                    field: 'id',
                    width: 2,
                },
                {
                    id: 2,
                    title: 'Наименование',
                    field: 'printable_name',
                    width: 9,
                },
                {
                    id: 3,
                    title: 'Код страны alpha-2',
                    field: 'iso_3166_1_a2',
                    width: 6,
                },
                {
                    id: 4,
                    title: 'Код страны alpha-3',
                    field: 'iso_3166_1_a3',
                    width: 6,
                },
                {
                    id: 5,
                    title: 'Код страны (цифровой)',
                    field: 'iso_3166_1_numeric',
                    width: 6,
                },
                {
                    id: 6,
                    title: 'Товаров',
                    field: 'display_order',
                    width: 6,
                },
                {
                    id: 7,
                    title: 'Доставка',
                    field: 'is_shipping_country',
                    width: 6,
                },
            ],
            entities: null,
            filterA2: '',
            page: 1,
            countEntities: 10,
            paginationData: null,
            totalCountEntities: false,
        }
    },
    async created() {
        await this.getTableData()
    },
    methods: {
        async getTableData(page = false) {
            const filters = {}
            const paginate = {}
            filters.iso_3166_1_a2 = this.filterA2
            paginate.page = page || this.page
            paginate.pp_items = this.countEntities
            try {
                const rawData = await fetch('/test/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify({
                        filters,
                        paginate,
                    }),
                })
                const data = await rawData.json()
                if (page) this.page = page
                this.entities = data.page_data.data
                this.paginationData = data.page_data.rpag
                if (data.page_data.rpag.total_count)
                    this.totalCountEntities = data.page_data.rpag.total_count
                if (this.filterA2) this.totalCountEntities = ''
            } catch (e) {
                console.error(e)
            }
        },
        setFilter(filter) {
            this.filterA2 = filter
            this.page = 1
            this.getTableData()
        },
    },
    computed: {
        getLastPage() {
            let lastPage = 0
            if (this.totalCountEntities)
                lastPage = Math.ceil(
                    this.totalCountEntities / this.countEntities
                )
            if (lastPage > this.page) return lastPage
            else return false
        },
    },
}
</script>

<style scoped>
.table__wrapper {
    max-width: 1200px;
    margin: 0 auto;
}

.table__body {
    max-width: fit-content;
    margin: auto;
}

.table__filter {
    min-height: 80px;
    margin-bottom: 12px;
}

.rows__wrapper {
    overflow-y: auto;
}

.header,
.line {
    display: grid;
    grid-template-columns: repeat(7, auto);
}

.line:nth-child(odd) {
    background-color: #d1dbe566;
}

.cell {
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #3d36ab40;
}

.cell div {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.header .cell {
    font-weight: bold;
    background-color: #adbbd1;
}

.quantity-entities {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 4px 0;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
}

.pages {
    display: flex;
    gap: 16px;
    width: 17rem;
    justify-content: center;
}

.page {
    width: 30px;
    height: 30px;
    background-color: #aab8d74a;
    /* margin: auto; */
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    cursor: pointer;
}

.page:hover {
    outline: 2px solid #0036fd47;
}

.current-page {
    cursor: default;
    background-color: #5b71dd;
    color: #fff;
    pointer-events: none;
    border: none !important;
}

.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    width: 200px;
    flex-wrap: wrap;
    bottom: 36px;
    background-color: #d0d2e7;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    border: 2px solid #0036fd47;
    z-index: 1;
}

.dropdown-content div {
    color: black;
    width: 40px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.dropdown-content div:hover {
    outline: 1px solid #fff;
    cursor: pointer;
}

.dropdown:hover .dropdown-content {
    display: flex;
}

@media screen and (max-width: 560px) {
    .quantity-entities {
        flex-direction: column;
    }

    .dropdown-content {
        right: -1rem;
    }

    .cell {
        width: 8rem !important;
        height: 3rem;
    }

    .rows__wrapper {
        display: flex;
    }

    .header,
    .line {
        grid-template-rows: repeat(7, auto);
        grid-template-columns: none;
    }
}
</style>