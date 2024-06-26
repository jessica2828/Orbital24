import { collection, query, where, getDocs } from 'firebase/firestore';

const searchUsers = async (searchText) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('name', '>=', searchText), where('name', '<=', searchText + '\uf8ff'));

  const querySnapshot = await getDocs(q);
  const users = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });

  return users;
};
