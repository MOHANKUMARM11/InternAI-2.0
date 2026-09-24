import React, { useState, useEffect } from 'react'
import { blockchainApi } from '../../api/blockchainApi'
import { ShieldCheck, ExternalLink, Link as LinkIcon } from 'lucide-react'

const CredentialPassport = () => {
  const [credentials, setCredentials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = await blockchainApi.getMyCredentials()
        setCredentials(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCredentials()
  }, [])

  if (loading) return <div className="p-6">Loading Credentials...</div>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <ShieldCheck size={32} className="text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blockchain Credential Passport</h1>
          <p className="text-gray-600">Your verifiable on-chain internship completion certificates.</p>
        </div>
      </div>

      {credentials.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center text-gray-500">
          <ShieldCheck size={48} className="mx-auto text-gray-300 mb-4" />
          <p>No credentials minted yet.</p>
          <p className="text-sm mt-2">Complete an internship to receive a verifiable blockchain credential.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map(cred => (
            <div key={cred._id} className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={100} />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${cred.status === 'minted' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {cred.status.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-800 mb-1">{cred.company?.name || 'Company'}</h3>
                <p className="text-sm text-gray-600 mb-6">Internship Completion Certificate</p>
                
                <div className="space-y-3">
                  <div className="bg-white bg-opacity-60 p-3 rounded border border-white">
                    <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-gray-700 truncate w-4/5" title={cred.transactionHash}>
                        {cred.transactionHash || 'Pending...'}
                      </span>
                      {cred.transactionHash && (
                        <a href={`https://polygonscan.com/tx/${cred.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-60 p-3 rounded border border-white">
                    <p className="text-xs text-gray-500 mb-1">Token ID / NFT</p>
                    <p className="text-sm font-mono text-gray-700">{cred.tokenId || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between items-center text-xs text-gray-500">
                  <span>Issued: {new Date(cred.issuedAt).toLocaleDateString()}</span>
                  <div className="flex items-center text-indigo-600 font-medium">
                    <LinkIcon size={12} className="mr-1" /> Polygon Network
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CredentialPassport
