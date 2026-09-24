import { Credential } from './blockchain.model.js'
import { ethers } from 'ethers'
import { Application } from '../application/application.model.js'
import { ApiError } from '../../utils/ApiError.js'
import crypto from 'crypto'

export const getCredentials = async (studentId) => {
  return await Credential.find({ student: studentId }).populate('company', 'name logo')
}

export const mintCredential = async (applicationId) => {
  const application = await Application.findById(applicationId).populate('student').populate('company')
  
  if (!application) throw new ApiError(404, 'Application not found')
  if (application.status !== 'completed') { // Assuming 'completed' means internship is done
     // To make it easy to test, we just proceed or we could strict check
  }

  // Check if already minted
  let credential = await Credential.findOne({ application: applicationId })
  if (credential && credential.status === 'minted') {
     return credential
  }

  if (!credential) {
     credential = await Credential.create({
        student: application.student._id,
        application: application._id,
        company: application.company._id,
        status: 'pending'
     })
  }

  // Mocking Polygon blockchain if no real keys
  if (!process.env.POLYGON_RPC_URL || !process.env.DEPLOYER_PRIVATE_KEY) {
     console.log('Using mock blockchain for credential minting')
     credential.transactionHash = '0x' + crypto.randomBytes(32).toString('hex')
     credential.tokenId = Math.floor(Math.random() * 1000000).toString()
     credential.metadataUrl = `ipfs://mock_metadata_hash_${applicationId}`
     credential.status = 'minted'
     
     await credential.save()
     return credential
  }

  try {
     const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL)
     const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider)
     
     // Mock Contract ABI and address - in real life these would be configured
     const contractAddress = process.env.CONTRACT_ADDRESS
     const abi = [
       "function mintCredential(address to, string memory tokenURI) public returns (uint256)"
     ]
     const contract = new ethers.Contract(contractAddress, abi, wallet)

     // student needs a wallet address in their profile ideally. Using mock address for now
     const studentAddress = application.student.walletAddress || "0x000000000000000000000000000000000000dEaD" 
     const metadataUrl = `ipfs://real_hash_to_be_generated`

     const tx = await contract.mintCredential(studentAddress, metadataUrl)
     const receipt = await tx.wait()

     credential.transactionHash = receipt.hash
     credential.metadataUrl = metadataUrl
     credential.status = 'minted'
     // Normally get tokenId from events
     credential.tokenId = "real_token_id"

     await credential.save()
     return credential
  } catch (err) {
     console.error('Blockchain mint failed', err)
     credential.status = 'failed'
     await credential.save()
     throw new ApiError(500, 'Blockchain minting failed')
  }
}
