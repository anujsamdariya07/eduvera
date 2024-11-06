'use client'

import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { SSG_GET_INITIAL_PROPS_CONFLICT } from 'next/dist/lib/constants'
import useSWRSubscription from 'swr/subscription'
import { db } from '../firebase'

export const useCourses = ({ uid }) => {
  const { data, error } = useSWRSubscription(
    ['courses', uid],
    ([path, uid], { next }) => {
      const collectionRef = query(
        collection(db, `courses`),
        where('instructorId', '==', uid)
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