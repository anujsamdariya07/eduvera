'use client'

import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { SSG_GET_INITIAL_PROPS_CONFLICT } from 'next/dist/lib/constants'
import useSWRSubscription from 'swr/subscription'
import { db } from '../firebase'

export const useSubscriptions = ({ uid }) => {
  const { data, error } = useSWRSubscription(
    ['subscriptions', uid],
    ([path, uid], { next }) => {
      const collectionRef = query(
        collection(db, `users/${uid}/subscriptions`),
        orderBy('timestamp', 'desc')
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

export const useSubscription = ({ uid, id }) => {
  const { data, error } = useSWRSubscription(
    ['subscription', uid, id],
    ([path, uid, id], { next }) => {
      const docRef = doc(db, `users/${uid}/subscriptions/${id}`)
      const unsub = onSnapshot(
        docRef,
        (snapshot) => {
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