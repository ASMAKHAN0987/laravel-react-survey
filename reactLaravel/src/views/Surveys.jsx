import React from 'react'
import PageComponent from '../components/PageComponent'
import SurveysListItems from '../components/SurveysListItems'
import TButton from '../components/core/TButton';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
const onDeleteClick = ()=>{
  console.log('on clicked');
}
function Surveys() {
  return (
    <>
       <PageComponent title="Surveys"
       buttons={(
        <TButton color='green' to='/surveys/create'>
            <PlusCircleIcon className='h-6 w-6 mr-2'/> Create new
        </TButton>
       )}>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
           {Surveys.map(()=>(
             <SurveysListItems survey={survey} key={survey.id} onDeleteClick={onDeleteClick}/>
           ))}
        </div>
       </PageComponent>
  </>
  )
}

export default Surveys