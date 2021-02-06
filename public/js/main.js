function modal() {
    document.querySelector('.modal-overlay')
        .classList.toggle('active')
        ,            // limpar fomulario
        Form.clearFlields()
}

function confirmdelete() {
    document.querySelector('.modal-delete')
        .classList.toggle('active')
        ,            // limpar fomulario
        Form.clearFlields()
}

const Storage = {

    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction)
        APP.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)
        // fechar o modal ao deleta
        confirmdelete()
        APP.reload()
    },
    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })
        return income;
    },
    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        })
        return expense;
    },
    total() {
        return Transaction.incomes() + Transaction.expenses();

    }
}

const DOM = {

    transactionContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)
        const td = ` 
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img onclick="confirmdelete(${index})" src="./assets/minus.svg" alt="Remover Transações"></td>
        `
        return td
    },

    updateBalance() {

        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())

        if (Transaction.total() > 0) {
            document.querySelector('.card.total').classList.add('positive')
            document.querySelector('.card.total').classList.remove('negative')
        } else {
            document.querySelector('.card.total').classList.remove('positive')
            document.querySelector('.card.total').classList.add('negative')
        }
    },

    clearTransaction() {
        DOM.transactionContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        // \D é uma expresão regular remover qual caracter que não seja numero
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

        return signal + value
    },
    formatAmount(value) {
        value = value * 100
        return Math.round(value)
    },
    formatDate(date) {
        const splitteDate = date.split("-")
        return `${splitteDate[2]}/${splitteDate[1]}/${splitteDate[0]}`
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateField() {
        const { description, amount, date } = Form.getValues()
        if (description.trim() === "" || amount.trim() === "" || date === "") {
            throw new Error("Por favor, preencha todos os campos");
        }
    },
    formatValues() {
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date
        }
    },
    clearFlields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    submit(event) {
        event.preventDefault()
        try {
            Form.validateField()
            const transaction = Form.formatValues()
            //salvar
            Transaction.add(transaction)
            // fechar modal ao cadastrar
            modal()
        } catch (error) {
            alert(error.message)
        }

    }
}
const APP = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransaction()
        APP.init()
    }
}

APP.init()

firebase.auth().onAuthStateChanged(user => {
    if (user == null) {
        // User is signed in.
        window.location.href = "./index.html"
    } else {
        var email = user.email
        document.querySelector("#profile_user").innerHTML = `<p>${email}</p>`
    }
});

function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
        var errorCode = error.code;
        var errorMessage = error.message;
    });
}