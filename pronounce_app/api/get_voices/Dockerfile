
FROM public.ecr.aws/lambda/python:3.8

RUN yum update -y

COPY lambda_function.py ${LAMBDA_TASK_ROOT}
COPY requirements.txt .
RUN python3.8 -m pip install -r requirements.txt -t .

CMD [ "lambda_function.lambda_handler" ]
