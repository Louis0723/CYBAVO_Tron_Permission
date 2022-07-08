import { useState, useMemo } from "react"

/* eslint-disable  react-hooks/exhaustive-deps */
function AddressWeight(props) {
    const typeName = props.typeName
    const [threshold, setThreshold] = useState(1)
    const [addressCount, setAddressCount] = useState(props.count)
    const [typeResult, setTypeResult] = useState([])
    useMemo(() => {
        props.callback(typeResult, threshold)
    }, [typeResult, threshold])
    typeResult.length = addressCount
    const addresses = useMemo(() => {
        const result = []
        for (let i = 0; i < addressCount; i++) {
            result.push(
                <div key={i}>
                    <input type="text" className="rounded w-8/12 border-rose-500" placeholder={`${typeName} address`}
                        onChange={(e) => {
                            typeResult[i] = {
                                ...typeResult[i], ...{ address: window.tronWeb.utils.base58.decode58(e.target.value).map(s => s.toString(16).padStart(2, '0')).join('').substr(0, 42) }
                            }
                            setTypeResult([...typeResult])
                        }} />
                    <input type="number" className="rounded w-4/12 border-rose-500" placeholder={`${typeName} weight`}
                        onChange={(e) => {
                            typeResult[i] = {
                                ...typeResult[i], ...{ weight: Number(e.target.value) }
                            }
                            setTypeResult([...typeResult])
                        }} />
                </div>
            )
        }
        return result
    }, [addressCount])

    return (
        <div>
            {typeName}
            <input type="number" className="rounded-full"
                value={threshold}
                onChange={(e) => e.target.value > 0 && setThreshold(Number(e.target.value))}
                placeholder={`${typeName} threshold`}
            />
            <div>
                <button className='px-4 py-2 m-1 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm'
                    onClick={() => {
                        (addressCount + 1 <= 5) && setAddressCount(addressCount + 1)
                    }}
                >+</button>
                <button className='px-4 py-2 m-1 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm'
                    onClick={() => {
                        (addressCount - 1 >= 0) && setAddressCount(addressCount - 1)
                    }}
                >-</button>
            </div>
            {addresses}
        </div>
    )
}

export default AddressWeight