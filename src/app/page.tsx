"use client"

import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.scss'
import { FaRegHeart, FaHeart, FaCat } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

type CatFact = {
  fact: string, 
  length?: number,
  isFavourited?: boolean
};
interface CatFactsInfo {
  number: number, 
  fact: string, 
  onRemove: () => void;
  onFav: () => void;
  isFav: boolean | undefined; 
}

const API_URL: string  = 'https://catfact.ninja/facts'

const CatFactsPage: React.FC<any> = (props) => {
  const [catFacts, setCatFacts] = useState([] as CatFact[]);
  const [modalState, setModalState] = useState(false);
  const [newFact, setNewFact] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((object) => {
        const savedFacts = JSON.parse(localStorage.getItem("favFacts") || "[]");
        object.data.map((catFact: CatFact) => {
          catFact.fact = catFact.fact;
          catFact.isFavourited = savedFacts.includes(catFact.fact);
        })
        setCatFacts(object.data.slice(0, 5));
      })
  }, []);

  function onRemove(idx: number) {
    const savedFacts = JSON.parse(localStorage.getItem("favFacts") || "[]");
    localStorage.setItem("favFacts", JSON.stringify(savedFacts.filter((fact: string) => fact != catFacts[idx].fact)));
    const updatedFactsArray = catFacts.slice(0, idx).concat(catFacts.slice(idx + 1));
    setCatFacts(updatedFactsArray);
  }

  function onFav(idx: number) {
    const allCatFacts = [...catFacts]
    const catObj = allCatFacts[idx];
    catObj.isFavourited = !catObj.isFavourited;
    setCatFacts(allCatFacts);
    const updatedFactArray = catFacts.filter((catFact) => catFact.isFavourited).map((catFact) => catFact.fact);
    localStorage.setItem("favFacts", JSON.stringify(updatedFactArray));
  }

  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);

  function addFact() {
    setCatFacts([...catFacts, {fact: newFact, isFavourited: false}]);
    closeModal();
  }

  const renderDialog = () => { 
    return (
        <dialog className={styles.modal}>
          <form onSubmit={addFact} className={styles.form}>
            <h1 className={styles.modalHeader}>Add your own cat fact!</h1>
            <input 
              type="text"
              placeholder='Enter fact here..'
              onChange={(e) => setNewFact(e.target.value)} 
            />
              <div
                className={styles.modalButtonsContainer}>
                <button type='submit'>Add fact</button>
                <button
                onClick={closeModal}>
                Cancel
                </button>
              </div>
          </form>
        </dialog>
    )
  }

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Some cool cat facts:</h1>
      <div className={styles.factsContainer}>
        {catFacts.map((catFact: CatFact, idx: number) => {
          return (
            <CatFacts
              key={idx}
              number={idx}
              fact={catFact.fact}
              onRemove={() => onRemove(idx)}
              onFav={() => onFav(idx)}
              isFav={catFact.isFavourited} 
            />
          )})}
      </div>
      {modalState && renderDialog()}
      <div className={styles.addButtonContainer}>
        <button
          className={styles.fab}
          onClick={openModal}>
            Add fact!
        </button>
      </div>
    </div>
  );
};

const CatFacts = (props: CatFactsInfo) => { 
  const { number, fact, onRemove, onFav, isFav } = props;

  return (
    <div className={styles.factCard}>
    <div className={styles.factContent}>
      <FaCat className={styles.catIcon} size={100} />
      <div className={styles.factText}>
        <h1 className={styles.factNumber}>{`Fact #${number + 1}`}</h1>
        <h1>{fact}</h1>
        <div className={styles.factButtonContainer}>
          <button onClick={onRemove}>
            <MdDeleteOutline size={30} />
          </button>
          <button
            className={isFav ? styles.fav : styles.unfav}
            onClick={onFav}>
            {isFav ? (<FaHeart size={25} className={styles.fav} />) : (<FaRegHeart size={25} />)}
          </button>
        </div>
      </div>
    </div>
  </div>
  )
};

export default CatFactsPage;
