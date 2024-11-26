import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'


export const getChapters = async ({courseId, chapterId}) => {
  try {
    const docRef = doc(db, `courses/${courseId}/chapters/${chapterId}`)
    const snap = await getDoc(docRef)
  
    if (snap.exists()) {
      const chapter = snap.data()

      const plainChapter = {
        ...chapter,
        timestampCreate: chapter.timestampCreate
        ? chapter.timestampCreate.toDate().toISOString()
        : null,
      }
      
      return snap.data()
    }
  
    return null
  } catch (error) {
    console.log('Error fetching chapter🙀')
    console.log(error)
  }
}