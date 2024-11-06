import { doc, collection, setDoc, Timestamp, updateDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const createNewCourse = async ({
  data,
  image,
  instructorId,
  instructorName,
  instructorPhotoURL,
  instructorEmail,
}) => {
  if (!data?.title) {
    throw new Error('Title is required!');
  }
  if (!image) {
    throw new Error('Image is required!');
  }
  if (!instructorId) {
    throw new Error('Instructor Id is required!');
  }

  try {
    // Generate new unique id
    const newId = doc(collection(db, 'courses')).id;

    // Reference of the image with a unique name
    const imageRef = ref(storage, `courses/${newId}_${image.name}`);

    // Uploading image
    await uploadBytes(imageRef, image);

    const imageURL = await getDownloadURL(imageRef);

    // Uploading the course details
    await setDoc(doc(db, `courses/${newId}`), {
      ...data,
      id: newId,
      imageURL: imageURL,
      instructorId: instructorId,
      instructorName: instructorName,
      instructorPhotoURL: instructorPhotoURL,
      instructorEmail: instructorEmail,
      timestampCreate: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error creating new course:', error);
    throw new Error('Failed to create new course');
  }
};

export const updateCourse = async ({
  data,
  image,
  instructorId,
  instructorName,
  instructorPhotoURL,
  instructorEmail,
}) => {
  if (!data?.id) {
    throw new Error('ID is required!');
  }
  if (!data?.title) {
    throw new Error('Title is required!');
  }
  if (!instructorId) {
    throw new Error('Instructor Id is required!');
  }

  let imageURL = data?.imageURL

  try {
    if (image) {
      // Reference of the image with a unique name
      const imageRef = ref(storage, `courses/${newId}_${image.name}`);
  
      // Uploading image
      await uploadBytes(imageRef, image);
  
      imageURL = await getDownloadURL(imageRef);
    }

    // Uploading the course details
    await updateDoc(doc(db, `courses/${data?.id}`), {
      ...data,
      imageURL: imageURL,
      instructorId: instructorId,
      instructorName: instructorName,
      instructorPhotoURL: instructorPhotoURL,
      instructorEmail: instructorEmail,
      timestampUpdate: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error creating new course:', error);
    throw new Error('Failed to create new course');
  }
};

export const deleteCourse = async ({ id }) => {
  await deleteDoc(doc(db, `courses/${id}`))
}
