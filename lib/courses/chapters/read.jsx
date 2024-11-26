'use client'

import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { SSG_GET_INITIAL_PROPS_CONFLICT } from 'next/dist/lib/constants'
import useSWRSubscription from 'swr/subscription'
import { db } from '../../firebase'

export const useChapters = ({ courseId }) => {
  const { data, error } = useSWRSubscription(
    ['chapters', courseId],
    ([path, courseId], { next }) => {
      const collectionRef = query(
        collection(db, `courses/${courseId}/chapters`),
        orderBy('timestampCreate', 'asc')
      )
      const unsub = onSnapshot(
        collectionRef, (snapshot) => {
          next(
            null,
            snapshot.empty ? null : snapshot.docs?.map((snap) => snap.data())
          )
        }, (error) => next(error, null)
      )
      return () => unsub()
    }
  )
  return { data, error, isLoading: data === undefined }
}

export const useChapter = ({ courseId, chapterId }) => {
  const { data, error } = useSWRSubscription(
    ['chapters', courseId, chapterId],
    ([path, courseId], { next }) => {
      const docRef = (
        doc(db, `courses/${courseId}/chapters/${chapterId}`)
      )
      const unsub = onSnapshot(
        docRef, (snapshot) => {
          next(
            null,
            !snapshot.exists() ? null : snapshot.data()
          )
        }, (error) => next(error, null)
      )
      return () => unsub()
    }
  )
  return { data, error, isLoading: data === undefined }
}
