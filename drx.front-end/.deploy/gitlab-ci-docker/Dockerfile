FROM amazonlinux:latest
RUN yum update -y
RUN amazon-linux-extras install docker -y
RUN yum install -y jq libxml2 python-pip tar gzip gcc gcc-c++ make zip
RUN pip install awscli
RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN yum install nodejs -y
