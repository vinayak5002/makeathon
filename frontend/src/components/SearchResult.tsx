import { FaCircleInfo } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import CodeSnippet from "./CodeSnippet";
import { ChatMessage, QueryType } from "../types/types";
import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import { Oval } from "react-loader-spinner";
import { generateHtmlTable } from "../utils/utils";
import { toast } from "react-toastify";

type SearchResultProps = {
	chatMessage: ChatMessage;
};

const SearchResult = ({ chatMessage }: SearchResultProps) => {
	const [isShowInfo, setIsShowInfo] = useState<boolean>(false);
	const [isShowExec, setIsShowExec] = useState<boolean>(false);

	const [isQuerDescLoading, setIsQueryDescLoading] = useState<boolean>(false);
	const [queryDesc, setQueryDesc] = useState<string>("");

	const [isExecLoading, setIsExecLoading] = useState<boolean>(false);
	const [execResult, setExecResult] = useState<string>("");

	const contentRef = useRef<HTMLDivElement | null>(null);

	const fetchData = async () => {
		try {
			setIsQueryDescLoading(true);

			const data = await api.sendSQL2Textquery(chatMessage.answer);

			setIsQueryDescLoading(false);

			setQueryDesc(data.description);

			console.log(data);
		} catch (err) {
			toast.error("Something went wrong")
			console.log(err);
		}
	}

	const fetchQueryExecResult = async () => {
		try {
			setIsExecLoading(true);

			console.log("Fetching data...");
			const query = chatMessage.type === QueryType.TEXT2SQL ? chatMessage.answer : chatMessage.question;

			const data = await api.executeQuery(query);

			console.log(data);

			setExecResult(generateHtmlTable(data));

			toast.success(data.message);			

			setIsExecLoading(false);
		}
		catch (err) {
			toast.error("Unable to execute the query")
			console.log("Execution Error");
			setIsExecLoading(false);
			console.log(err);
		}
	}

	const toggleInfo = () => {
		const newState = !isShowInfo;
		if (newState) {
			fetchData();
		}
		setIsShowInfo(newState);
	};

	const toggleExecute = () => {
		const newState = !isShowExec;
		if (newState) {
			fetchQueryExecResult();
		}
		setIsShowExec(newState);
	}

	useEffect(() => {
		setIsShowInfo(false);
		setIsShowExec(false);
	}, [chatMessage]);

	return (
		<div className="mb-4 flex flex-row w-full justify-center items-stretch"> {/* Added items-stretch */}
			<div className={`bg-secondary p-4 rounded-lg shadow-md ${isShowInfo ? 'w-2/3' : 'w-[80%]'} flex-shrink-0`}>
				<div className="w-auto mb-4 flex flex-row justify-between items-center">
					<h3>Question: {chatMessage.type === QueryType.TEXT2SQL && chatMessage.question}</h3>
					{
						chatMessage.type === QueryType.SQL2TEXT && (
							<div className="bg-primary text-white p-2 rounded-lg">
								{chatMessage.question}
							</div>
						)
					}
					<div className="flex flex-row">
						<div className={`p-2 bg-primary rounded-lg cursor-pointer ml-2 mr-2`} onClick={toggleExecute}>
							<FaPlayCircle size={20} />
						</div>
						<div className={`${chatMessage.type === QueryType.SQL2TEXT && "hidden"} p-2 bg-primary rounded-lg cursor-pointer`} onClick={toggleInfo}>
							<FaCircleInfo size={20} />
						</div>
					</div>
				</div>
				<div>
					<h1 className="" >Response:</h1>
					{
						chatMessage.type === QueryType.TEXT2SQL ?
							<CodeSnippet snip={chatMessage.answer} /> :
							chatMessage.answer
					}
				</div>

				{
					isShowExec && (
						<div className="overflow-x-auto whitespace-nowrap">
							<h1 className="mt-2">Execution result:</h1>
							{
								isExecLoading ?
									<Oval
										visible={true}
										height="30"
										width="30"
										color="#ffffff"
										secondaryColor="#444444"
										ariaLabel="tail-spin-loading"
										wrapperStyle={{}}
										wrapperClass=""
									/>
									:
									<pre>
										<div dangerouslySetInnerHTML={{ __html: execResult }} />
									</pre>
							}
						</div>
					)
				}

			</div>
			{isShowInfo && (
				<div className="bg-secondary p-4 rounded-lg shadow-md w-1/3 h-auto ml-2 flex flex-col justify-center">
					<p className="mb-2">Query explanation: </p>
					{
						isQuerDescLoading ?

							<Oval
								visible={true}
								height="30"
								width="30"
								color="#ffffff"
								secondaryColor="#444444"
								ariaLabel="tail-spin-loading"
								wrapperStyle={{}}
								wrapperClass=""
							/>
							:
							<div className="bg-primary" style={{ position: 'relative', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
								<div ref={contentRef} style={{ maxHeight: '500px', overflowY: 'auto' }}>
									{queryDesc}
								</div>
							</div>
					}
				</div>
			)}
		</div>
	);

};

export default SearchResult;
