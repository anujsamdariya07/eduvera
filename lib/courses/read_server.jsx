import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"

export const getCourse = async ({id}) => {
  // Make a refernce
  const ref = doc(db, `courses/${id}`)

  const res = await getDoc(ref)

  if (res.exists()) {
    return res.data()
  } else {
    return null
  }
}