import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { internshipApi } from '../../api/internshipApi'

const PostInternship = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      domain: 'Frontend',
      location: '',
      isRemote: false,
      stipend: '',
      duration: '',
      openings: 1,
      skillsRequired: []
    }
  })

  const skillsArr = watch('skillsRequired') || []

  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = e.target.value.trim()
      if (val && !skillsArr.includes(val)) {
        setValue('skillsRequired', [...skillsArr, val])
        e.target.value = ''
      }
    }
  }

  const removeSkill = (sk) => {
    setValue('skillsRequired', skillsArr.filter(s => s !== sk))
  }

  const onSubmit = async (data) => {
    try {
      if (data.stipend) data.stipend = Number(data.stipend)
      data.openings = Number(data.openings)
      await internshipApi.createInternship(data)
      alert('Internship Posted Successfully!')
      navigate('/company/internships')
    } catch (error) {
      alert(error.response?.data?.message || 'Error posting internship')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Post New Internship</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-sm border space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Internship Title</label>
          <input {...register('title')} required className="w-full border p-2 rounded" placeholder="e.g. React Developer Intern" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea {...register('description')} required className="w-full border p-2 rounded" rows="5" placeholder="Details about the role..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Domain</label>
            <select {...register('domain')} required className="w-full border p-2 rounded">
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full-Stack">Full-Stack</option>
              <option value="Data Science">Data Science</option>
              <option value="ML/AI">ML/AI</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of Openings</label>
            <input type="number" min="1" {...register('openings')} required className="w-full border p-2 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input {...register('location')} className="w-full border p-2 rounded" placeholder="e.g. Bangalore, India" />
          </div>
          <div className="flex items-center mt-6">
            <input type="checkbox" id="isRemote" {...register('isRemote')} className="mr-2 h-4 w-4" />
            <label htmlFor="isRemote" className="text-sm font-medium">This is a Remote internship</label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Stipend (per month in ₹)</label>
            <input type="number" {...register('stipend')} className="w-full border p-2 rounded" placeholder="Leave empty if unpaid" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input {...register('duration')} className="w-full border p-2 rounded" placeholder="e.g. 3 months" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Skills Required (Press Enter)</label>
          <input type="text" onKeyDown={handleAddSkill} className="w-full border p-2 rounded" placeholder="e.g. React, Node.js" />
          <div className="flex flex-wrap gap-2 mt-2">
            {skillsArr.map((sk, i) => (
              <span key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center">
                {sk}
                <button type="button" onClick={() => removeCulture(sk)} className="ml-2 text-indigo-500 hover:text-indigo-700">x</button>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t mt-6 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50">
            {isSubmitting ? 'Posting...' : 'Post Internship'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostInternship
