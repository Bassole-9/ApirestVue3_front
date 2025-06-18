<template>
  <div class="container">
    <div class="boxTitre">
      <p class="titre">API REST Vue3</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <input v-model="form.name" type="text" placeholder="Nom" required />
      <input v-model="form.email" type="email" placeholder="Email" required />
      <input v-model="form.password" type="password" placeholder="Mot de passe" :required="!isEditing" />
      <input v-model="form.age" type="number" placeholder="Âge" required min="0" />
      <button type="submit">
        {{ isEditing ? 'Modifier' : 'Ajouter' }}
      </button>
    </form>

    <!-- Zone de chargement -->
    <div v-if="isLoading" class="loading">
      Chargement des utilisateurs...
    </div>

    <!-- Tableau affiché uniquement si les données sont prêtes -->
    <table v-else class="table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Mot de passe</th>
          <th>Âge</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>••••••••</td>
          <td>{{ user.age }}</td>
          <td>
            <button class="btn edit" @click="editUser(user)">Modifier</button>
            <button class="btn delete" @click="deleteUser(user._id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

export default {
  name: 'UserManager',
  setup() {
    const users = ref([])
    const isEditing = ref(false)
    const isLoading = ref(false)
    const selectedId = ref(null)
    const toast = useToast()

    const form = reactive({
      name: '',
      email: '',
      password: '',
      age: null
    })

    const toastSuccess = (msg) => {
      toast.success(`${msg}`, {
        position: 'top-right',
        timeout: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        style: {
          background: '#d1e7dd',
          color: '#0f5132',
          borderLeft: '6px solid #198754',
          padding: '12px 16px',
          fontWeight: 'bold'
        }
      })
    }

    const toastError = (msg) => {
      toast.error(`${msg}`, {
        position: 'top-right',
        timeout: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        style: {
          background: '#f8d7da',
          color: '#842029',
          borderLeft: '6px solid #dc3545',
          padding: '12px 16px',
          fontWeight: 'bold'
        }
      })
    }

    const fetchUsers = async () => {
      isLoading.value = true
      try {
        const res = await axios.get('http://localhost:5000/api/users')
        users.value = res.data.users
      } catch (err) {
        toastError('Erreur lors du chargement des utilisateurs.')
        console.error(err)
      } finally {
        isLoading.value = false
      }
    }

    const handleSubmit = async () => {
      try {
        const payload = {
          name: form.name,
          email: form.email,
          age: form.age
        }
        if (form.password.trim() !== '') {
          payload.password = form.password
        }

        if (isEditing.value) {
          await axios.put(`http://localhost:5000/api/users/${selectedId.value}`, payload)
          toastSuccess('Utilisateur modifié avec succès.')
        } else {
          if (!payload.password) {
            toastError('Le mot de passe est requis pour créer un utilisateur.')
            return
          }
          await axios.post('http://localhost:5000/api/users', payload)
          toastSuccess('Utilisateur ajouté avec succès.')
        }

        form.name = ''
        form.email = ''
        form.password = ''
        form.age = null
        isEditing.value = false
        selectedId.value = null

        await fetchUsers()
      } catch (err) {
        console.log(err.response.data.error)
        toastError(`${err.response.data.error}`)
      }
    }

    const editUser = (user) => {
      form.name = user.name
      form.email = user.email
      form.password = ''
      form.age = user.age
      selectedId.value = user._id
      isEditing.value = true
    }

    const deleteUser = async (id) => {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`)
        toastSuccess('Utilisateur supprimé avec succès.')
        await fetchUsers()
      } catch (err) {
        toastError('Erreur lors de la suppression.')
        console.error(err)
      }
    }

    onMounted(fetchUsers)

    return {
      users,
      form,
      isEditing,
      isLoading,
      handleSubmit,
      editUser,
      deleteUser
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  margin-top: 2rem;
}

input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1 1 150px;
  min-width: 120px;
}

button[type="submit"] {
  background-color: #0d6efd;
  color: white;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  min-width: 100px;
}

button[type="submit"]:hover {
  background-color: #0b5ed7;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.table th {
  background-color: #f5f5f5;
}

.btn {
  padding: 6px 12px;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.edit {
  background-color: #F59E0B;
  margin-right: 5px;
}

.edit:hover {
 background-color: #F59E0B;
}

.delete {
  background-color: #dc3545;
}

.delete:hover {
  background-color: #bb2d3b;
}

.boxTitre {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  padding-top: 3rem;
  padding-bottom: 3rem;
  background: linear-gradient(to right, #6366F1, #8B5CF6);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.titre {
  font-weight: bold;
  font-size: 32px;
  color: white;
}

/* Style loading */
.loading {
  text-align: center;
  font-weight: bold;
  color: #6366F1;
  padding: 1rem;
  font-size: 18px;
}
</style>
