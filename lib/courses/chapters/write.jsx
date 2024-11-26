import { doc, collection, setDoc, updateDoc, Timestamp, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from '../../firebase'

const convertTimestampToPlainObject = (timestamp) => {
  return {
    seconds: timestamp.seconds,
    nanoseconds: timestamp.nanoseconds,
  };
};

export const createNewChapter = async (
  {
    courseId,
    data,
    file,
    fileType,
    progressCallback,
  }
) => {
  if (!courseId) {
    throw new Error('Course Id is required!')
  }
  if (!data) {
    throw new Error('Data is required!')
  }
  if (!fileType) {
    throw new Error('File Type is required!')
  }

  console.log('111')
  // Create a new id for creating a new chapter
  // const newId = doc(collection(db, 'courses')).id;
  // const newId = doc(collection(db, `courses/${courseId}/chapters`)).id
  const chaptersCollectionRef = collection(db, `courses/${courseId}/chapters`);
  const newChapterDocRef = doc(chaptersCollectionRef);
  const newId = newChapterDocRef.id;

  console.log('222')
  // Creating a reference of chapter
  const chapterRef = doc(db, `courses/${courseId}/chapters/${newId}`)

  console.log('333')
  // Checking for the fileType
  if (fileType === 'youtube') {
    // No need to upload any file
    await setDoc(chapterRef, {
      ...data,
      courseId: courseId,
      fileType: fileType,
      id: newId,
      timestampCreate: convertTimestampToPlainObject(Timestamp.now()),
    })
  } else {
    // We want to show the progress to the user of video being uploaded, for this we will use a callback function, for that, we need to return a promise
    return new Promise((resolve, reject) => {

      const storageRef = ref(storage, 'chapters/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressCallback(progress)
        },
        (error) => {
          reject(error)
        },
        async () => {
          const fileURL = await getDownloadURL(uploadTask.snapshot.ref)
          // Now we will also upload fileURL
          await setDoc(chapterRef, {
            ...data,
            courseId: courseId,
            fileType: fileType,
            id: newId,
            fileURL: fileURL,
            timestampCreate: convertTimestampToPlainObject(Timestamp.now()),
          })
        }
      );
      resolve(true)

    })
  }
}

export const updateChapter = async (
  {
    courseId,
    data,
    file,
    fileType,
    progressCallback,
  }
) => {
  if (!courseId) {
    throw new Error('Course Id is required!')
  }
  if (!data?.id) {
    throw new Error('ID is required!')
  }
  if (!fileType) {
    throw new Error('File Type is required!')
  }

  console.log('111')
  // Create a new id for creating a new chapter
  // const newId = doc(collection(db, 'courses')).id;
  // const newId = doc(collection(db, `courses/${courseId}/chapters`)).id
  const chaptersCollectionRef = collection(db, `courses/${courseId}/chapters`);
  const newChapterDocRef = doc(chaptersCollectionRef);

  console.log('222')
  // Creating a reference of chapter
  const chapterRef = doc(db, `courses/${courseId}/chapters/${data?.id}`)

  console.log('333')
  // Checking for the fileType
  // If fileType is youtube or no file is provided, then we don't need to upload the file
  if (fileType === 'youtube' || !file) {
    // No need to upload any file
    await updateDoc(chapterRef, {
      ...data,
      courseId: courseId,
      fileType: fileType,
      timestampUpdate: Timestamp.now(),
    })
  } else {
    // We want to show the progress to the user of video being uploaded, for this we will use a callback function, for that, we need to return a promise
    return new Promise((resolve, reject) => {

      const storageRef = ref(storage, 'chapters/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressCallback(progress)
        },
        (error) => {
          reject(error)
        },
        async () => {
          const fileURL = await getDownloadURL(uploadTask.snapshot.ref)
          // Now we will also upload fileURL
          await updateDoc(chapterRef, {
            ...data,
            courseId: courseId,
            fileType: fileType,
            fileURL: fileURL,
            timestampUpdate: Timestamp.now(),
          })
        }
      );
      resolve(true)

    })
  }
}

export const deleteChapter = async ({courseId, chapterId}) => {
  try {
    await deleteDoc(doc(db, `courses/${courseId}/chapters/${chapterId}`))
  } catch (error) {
    console.log('Error deleting chapter!🙀')
    console.log(error)
  }
}
