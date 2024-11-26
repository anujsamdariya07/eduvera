import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  orderBy, 
  query,
} from "firebase/firestore"
import { db } from "../firebase"

export const getCourse = async ({ id }) => {
  // Make a refernce
  const ref = doc(db, `courses/${id}`)

  const res = await getDoc(ref)

  if (res.exists()) {
    const course = res.data()

    const plainCourse = {
      ...course,
      timestampCreate: course.timestampCreate
        ? course.timestampCreate.toDate().toISOString()
        : null,
    }
    
    return plainCourse
  } else {
    return null
  }
}

export const getAllCourses = async () => {
  // It will fetch the entire document for whihc the quiery is passed
  const snapshots = await getDocs(
    query(
      collection(db, 'courses'), 
      orderBy('timestampCreate', 'desc')
    )
  )

  return snapshots.docs.map((item) => item?.data())
}
