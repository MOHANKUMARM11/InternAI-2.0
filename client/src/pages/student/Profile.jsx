import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useStudentStore } from '../../store/studentStore'
import { Upload, X, Plus } from 'lucide-react'

const Profile = () => {
  const { profile, loading, fetchProfile, updateProfile, uploadResume } = useStudentStore()
  const [activeTab, setActiveTab] = useState(1)
  const [resumeFile, setResumeFile] = useState(null)

  const { register, control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      college: '',
      cgpa: '',
      careerGoal: '',
      skills: [],
      preferredDomains: [],
      education: [],
      projects: [],
      experience: [],
      portfolioLinks: { github: '', linkedin: '', website: '' }
    }
  })

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' })
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control, name: 'projects' })
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experience' })

  const skillsArr = watch('skills') || []

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile) {
      reset({
        college: profile.college || '',
        cgpa: profile.cgpa || '',
        careerGoal: profile.careerGoal || '',
        skills: profile.skills || [],
        preferredDomains: profile.preferredDomains || [],
        education: profile.education || [],
        projects: profile.projects || [],
        experience: profile.experience || [],
        portfolioLinks: profile.portfolioLinks || { github: '', linkedin: '', website: '' }
      })
    }
  }, [profile, reset])

  const onSubmit = async (data) => {
    await updateProfile(data)
    alert('Profile updated!')
  }

  const handleResumeUpload = async (e) => {
    e.preventDefault()
    if (!resumeFile) return
    await uploadResume(resumeFile)
    alert('Resume uploaded successfully!')
    setResumeFile(null)
  }

  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = e.target.value.trim()
      if (val && !skillsArr.includes(val)) {
        setValue('skills', [...skillsArr, val])
        e.target.value = ''
      }
    }
  }

  const removeSkill = (sk) => {
    setValue('skills', skillsArr.filter(s => s !== sk))
  }

  if (loading && !profile) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      <div className="flex border-b border-gray-200 mb-6 space-x-4">
        {['Basic Info', 'Education', 'Projects & Exp', 'Resume & Links'].map((tab, idx) => (
          <button 
            key={idx}
            className={`pb-2 px-1 ${activeTab === idx + 1 ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab(idx + 1)}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-sm">
        {/* TAB 1: BASIC INFO */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">College/University</label>
              <input {...register('college')} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CGPA</label>
              <input type="number" step="0.1" {...register('cgpa')} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Career Goal</label>
              <input {...register('careerGoal')} className="w-full border p-2 rounded" placeholder="e.g. Full-Stack Developer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Skills (Press Enter)</label>
              <input type="text" onKeyDown={handleAddSkill} className="w-full border p-2 rounded" placeholder="Add a skill" />
              <div className="flex flex-wrap gap-2 mt-2">
                {skillsArr.map((sk, i) => (
                  <span key={i} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm flex items-center">
                    {sk}
                    <button type="button" onClick={() => removeSkill(sk)} className="ml-1 text-indigo-500 hover:text-indigo-700">
                      <X size={14}/>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EDUCATION */}
        {activeTab === 2 && (
          <div>
            {eduFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded mb-4 relative bg-gray-50">
                <button type="button" onClick={() => removeEdu(index)} className="absolute top-2 right-2 text-red-500"><X size={18}/></button>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium">Degree</label>
                    <input {...register(`education.${index}.degree`)} className="w-full border p-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Institution</label>
                    <input {...register(`education.${index}.institution`)} className="w-full border p-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Year</label>
                    <input type="number" {...register(`education.${index}.year`)} className="w-full border p-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Percentage / CGPA</label>
                    <input type="number" step="0.1" {...register(`education.${index}.percentage`)} className="w-full border p-2 rounded text-sm" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => appendEdu({ degree: '', institution: '', year: '', percentage: '' })} className="flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-800">
              <Plus size={16} className="mr-1"/> Add Education
            </button>
          </div>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === 3 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Projects</h3>
            {projFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded mb-4 relative bg-gray-50">
                <button type="button" onClick={() => removeProj(index)} className="absolute top-2 right-2 text-red-500"><X size={18}/></button>
                <div className="space-y-3">
                  <input {...register(`projects.${index}.title`)} placeholder="Project Title" className="w-full border p-2 rounded text-sm font-medium" />
                  <textarea {...register(`projects.${index}.description`)} placeholder="Description" className="w-full border p-2 rounded text-sm" rows="2" />
                  <input {...register(`projects.${index}.link`)} placeholder="Link (GitHub/Live)" className="w-full border p-2 rounded text-sm" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => appendProj({ title: '', description: '', techStack: [], link: '' })} className="flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-800 mb-8">
              <Plus size={16} className="mr-1"/> Add Project
            </button>
            
            <h3 className="font-semibold text-gray-700 mb-2">Experience</h3>
            {expFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded mb-4 relative bg-gray-50">
                <button type="button" onClick={() => removeExp(index)} className="absolute top-2 right-2 text-red-500"><X size={18}/></button>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <input {...register(`experience.${index}.role`)} placeholder="Role" className="w-full border p-2 rounded text-sm font-medium" />
                  <input {...register(`experience.${index}.company`)} placeholder="Company" className="w-full border p-2 rounded text-sm" />
                </div>
                <div className="space-y-3">
                  <input {...register(`experience.${index}.duration`)} placeholder="Duration (e.g. Jan 2023 - Mar 2023)" className="w-full border p-2 rounded text-sm" />
                  <textarea {...register(`experience.${index}.description`)} placeholder="Description" className="w-full border p-2 rounded text-sm" rows="2" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => appendExp({ role: '', company: '', duration: '', description: '' })} className="flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-800">
              <Plus size={16} className="mr-1"/> Add Experience
            </button>
          </div>
        )}

        {/* TAB 4: RESUME & LINKS */}
        {activeTab === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Portfolio Links</h3>
              <div className="space-y-3">
                <input {...register('portfolioLinks.github')} placeholder="GitHub Profile URL" className="w-full border p-2 rounded text-sm" />
                <input {...register('portfolioLinks.linkedin')} placeholder="LinkedIn Profile URL" className="w-full border p-2 rounded text-sm" />
                <input {...register('portfolioLinks.website')} placeholder="Personal Website URL" className="w-full border p-2 rounded text-sm" />
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Resume (PDF)</h3>
              {profile?.resumeUrl && (
                <div className="mb-3 text-sm text-green-600 font-medium">
                  ✓ Resume uploaded. <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="underline">View PDF</a>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => setResumeFile(e.target.files[0])} 
                  className="border p-2 rounded text-sm w-full"
                />
                <button 
                  type="button" 
                  onClick={handleResumeUpload}
                  disabled={!resumeFile || loading}
                  className="bg-gray-800 text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
                >
                  <Upload size={16} className="mr-2"/> Upload
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t flex justify-end">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Profile
